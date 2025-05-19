
import {
  createPublicClient,
  http,
  parseAbiItem,
  decodeEventLog,
  Hex,
  TransactionReceiptNotFoundError,
  BlockNotFoundError,
} from 'viem';
import { mainnet } from 'viem/chains'; // Or your target chain
import { db } from '@/db'; 
import {
  users,
  userXaumBalances,
  userHyperIndexLpBalances,
  userHyperIndexLpRecords,
  lpRecordTypeEnum,
} from '@/db/schema';
import {
  XAUM_TOKEN_ADDRESS,
  XAUM_TOKEN_ABI,
  HYPERINDEX_LP_MANAGER_ADDRESS,
  HYPERINDEX_LP_MANAGER_ABI,
  // LP_TOKEN_CONTRACTS, // If you have individual LP token contracts to monitor
} from '@/config/contracts'; // Adjust path as needed
import { eq, sql, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import Decimal from 'decimal.js';

// Define token decimal constants or fetch them dynamically if they vary
const XAUM_TOKEN_DECIMALS = 18;
const DEFAULT_LP_TOKEN_DECIMALS = 18; // Adjust if LP tokens have different decimals

const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("RPC_URL environment variable is not set.");
}
const START_BLOCK = process.env.START_BLOCK ? BigInt(process.env.START_BLOCK) : 0n; // Default to 0 or a sensible contract deployment block
const HISTORICAL_SYNC_BLOCK_INTERVAL = 100n; // Process 100 blocks at a time for historical sync

// Placeholder for a more persistent way to store the last processed block
let lastProcessedBlock: bigint | null = null; // In a real app, read this from DB

const publicClient = createPublicClient({
  chain: mainnet, // Configure for your specific chain
  transport: http(RPC_URL),
});// In your chainScannerService.ts

// At the start of syncHistoricalEvents or startChainScanner
async function getScannerStartingBlock(scannerId: string, defaultStartBlock: bigint): Promise<bigint> {
  const state = await db.query.scannerState.findFirst({
    where: eq(scannerState.id, scannerId) // or eq(scannerState.eventName, 'your_event_name')
  });
  if (state && state.lastSuccessfullyProcessedBlock) {
    console.log(`Resuming from lastSuccessfullyProcessedBlock: ${state.lastSuccessfullyProcessedBlock}`);
    return BigInt(state.lastSuccessfullyProcessedBlock) + 1n;
  }
  console.log(`No previous state found for ${scannerId}, starting from default: ${defaultStartBlock}`);
  return defaultStartBlock;
}

// After processing a chunk in syncHistoricalEvents (e.g., up to 'processedUptoBlock')
async function updateScannerState(
    scannerId: string, 
    currentProcessing: bigint, 
    lastSuccessful: bigint, 
    confirmationDelay: bigint
) {
  const confirmed = lastSuccessful - confirmationDelay > 0n ? lastSuccessful - confirmationDelay : 0n;
  await db.insert(scannerState)
    .values({
      id: scannerId, // or eventName: 'your_event_name'
      currentProcessingBlock: currentProcessing.toString(),
      lastSuccessfullyProcessedBlock: lastSuccessful.toString(),
      confirmedBlockCursor: confirmed.toString(),
      updatedAt: new Date() 
    })
    .onConflictDoUpdate({
      target: scannerState.id, // or scannerState.eventName
      set: {
        currentProcessingBlock: currentProcessing.toString(),
        lastSuccessfullyProcessedBlock: lastSuccessful.toString(),
        confirmedBlockCursor: confirmed.toString(),
        updatedAt: new Date()
      }
    });
  console.log(`Scanner state updated for ${scannerId}: Last successful block ${lastSuccessful}`);
}

// --- In syncHistoricalEvents loop ---
// ... after processing logs for the chunk ending at 'toBlock'
// const CONFIRMATION_BLOCK_DELAY = 12n;
// await updateScannerState('main_scanner', toBlock, toBlock, CONFIRMATION_BLOCK_DELAY);
// lastProcessedBlock = toBlock; // Update in-memory variable too


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

async function getBlockTimestamp(blockNumber: bigint): Promise<Date> {
  try {
    const block = await publicClient.getBlock({ blockNumber });
    return new Date(Number(block.timestamp) * 1000);
  } catch (error) {
    if (error instanceof BlockNotFoundError) {
      console.warn(`Block ${blockNumber} not found, attempting to refetch...`);
      // Implement a short delay and retry logic if necessary, or use a fallback
      await new Promise(resolve => setTimeout(resolve, 1000));
      const block = await publicClient.getBlock({ blockNumber }); // Retry once
      return new Date(Number(block.timestamp) * 1000);
    }
    console.error(`Error fetching block ${blockNumber}:`, error);
    return new Date(); // Fallback, though ideally you'd handle this more robustly
  }
}

async function ensureUserExists(walletAddress: string, txHash: Hex, blockNumber: bigint, eventTimestamp: Date) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.walletAddress, walletAddress.toLowerCase()),
  });

  if (!existingUser) {
    try {
      await db.insert(users).values({
        walletAddress: walletAddress.toLowerCase(),
        createdAt: new Date(), // DB default
        // The users table in the provided schema.ts does not have txHash, blockNumber, eventTimestamp
        // If they were added, uncomment and use:
        // transactionHash: txHash,
        // blockNumber: blockNumber.toString(), // Or blockNumber if schema is bigint
        // eventTimestamp: eventTimestamp,
      }).onConflictDoNothing(); // In case of race conditions if multiple events create same user
      console.log(`Created user: ${walletAddress}`);
    } catch (dbError) {
      console.error(`Error creating user ${walletAddress}:`, dbError);
    }
  }
}

async function updateUserXaumBalance(
  walletAddress: string,
  changeAmount: Decimal, // Positive for increase, negative for decrease
  txHash: Hex,
  blockNumber: bigint,
  eventTimestamp: Date
) {
  if (walletAddress === ZERO_ADDRESS) return;
  const lowerWalletAddress = walletAddress.toLowerCase();
  await ensureUserExists(lowerWalletAddress, txHash, blockNumber, eventTimestamp);

  await db.transaction(async (tx) => {
    const currentBalanceRecord = await tx.query.userXaumBalances.findFirst({
      where: eq(userXaumBalances.userWalletAddress, lowerWalletAddress),
    });

    let newBalance: Decimal;
    if (currentBalanceRecord) {
      newBalance = new Decimal(currentBalanceRecord.balance).plus(changeAmount);
    } else {
      newBalance = changeAmount;
      if (newBalance.isNegative()) {
        console.warn(`Attempting to set negative initial XAUM balance for ${lowerWalletAddress}. Setting to 0.`);
        newBalance = new Decimal(0);
      }
    }
    if (newBalance.isNegative()) {
        console.warn(`XAUM Balance for ${lowerWalletAddress} would go negative (${newBalance.toString()}). Clamping to 0.`);
        newBalance = new Decimal(0);
    }

    await tx.insert(userXaumBalances)
      .values({
        id: createId(),
        userWalletAddress: lowerWalletAddress,
        balance: newBalance.toFixed(8), // Ensure correct precision
        lastUpdatedAt: eventTimestamp, // Reflect the event time as last update
        // The userXaumBalances table in schema.ts does not have txHash, blockNumber, eventTimestamp
        // If they were added, uncomment and use:
        // transactionHash: txHash,
        // blockNumber: blockNumber.toString(),
        // eventTimestamp: eventTimestamp,
      })
      .onConflictDoUpdate({
        target: userXaumBalances.userWalletAddress,
        set: {
          balance: newBalance.toFixed(8),
          lastUpdatedAt: new Date(),
          transactionHash: txHash,
          // The userXaumBalances table in schema.ts does not have txHash, blockNumber, eventTimestamp
          // If they were added, uncomment and use:
          // blockNumber: blockNumber.toString(),
          eventTimestamp: eventTimestamp,
        },
      });
    console.log(`Updated XAUM balance for ${lowerWalletAddress} to ${newBalance.toString()}`);
  });
}

async function handleXaumTransferEvent(log: any) {
  const eventTimestamp = await getBlockTimestamp(log.blockNumber);
  const { from, to, value } = log.args;

  console.log(`XAUM Transfer from ${from} to ${to} amount ${value.toString()} at block ${log.blockNumber}`);

  const amount = new Decimal(value.toString()).div(new Decimal(10).pow(XAUM_TOKEN_DECIMALS));

  if (from && from !== ZERO_ADDRESS) {
    await updateUserXaumBalance(from, amount.negated(), log.transactionHash, log.blockNumber, eventTimestamp);
  }
  if (to && to !== ZERO_ADDRESS) {
    await updateUserXaumBalance(to, amount, log.transactionHash, log.blockNumber, eventTimestamp);
  }
}

async function updateLpBalance(
  tx: typeof db, // Drizzle transaction instance
  userWalletAddress: string,
  lpTokenSymbol: string,
  changeAmount: Decimal, // Positive for increase, negative for decrease
  txHash: Hex,
  blockNumber: bigint,
  eventTimestamp: Date
) {
  const currentBalanceRecord = await tx.query.userHyperIndexLpBalances.findFirst({
      where: and(
          eq(userHyperIndexLpBalances.userWalletAddress, userWalletAddress),
          eq(userHyperIndexLpBalances.lpTokenSymbol, lpTokenSymbol)
      )
  });

  let newBalance: Decimal;
  if (currentBalanceRecord) {
      newBalance = new Decimal(currentBalanceRecord.balance).plus(changeAmount);
  } else {
      newBalance = changeAmount;
      if (newBalance.isNegative()) newBalance = new Decimal(0); // Prevent negative initial balance
  }
  if (newBalance.isNegative()) newBalance = new Decimal(0); // Prevent balance from going negative

  await tx.insert(userHyperIndexLpBalances)
    .values({
      id: createId(),
      userWalletAddress: userWalletAddress,
      lpTokenSymbol: lpTokenSymbol,
      balance: newBalance.toFixed(8), // Ensure correct precision
      lastUpdatedAt: eventTimestamp, // Reflect event time
      // The userHyperIndexLpBalances table in schema.ts does not have txHash, blockNumber, eventTimestamp
      // If they were added, uncomment and use:
      // transactionHash: txHash,
      // blockNumber: blockNumber.toString(),
      // eventTimestamp: eventTimestamp,
    })
    .onConflictDoUpdate({
      target: [userHyperIndexLpBalances.userWalletAddress, userHyperIndexLpBalances.lpTokenSymbol],
      set: {
        balance: newBalance.toFixed(8),
        lastUpdatedAt: eventTimestamp,
        // transactionHash: txHash, // if added to schema
        // blockNumber: blockNumber.toString(), // if added to schema
        // eventTimestamp: eventTimestamp, // if added to schema
      },
    });
  console.log(`Updated LP balance for ${userWalletAddress}, ${lpTokenSymbol} to ${newBalance.toString()}`);
}

async function processLpEvent(
  log: any,
  recordType: typeof lpRecordTypeEnum.enumValues[number],
  balanceChangeMultiplier: 1 | -1 | 0 // 1 for increase, -1 for decrease, 0 for no direct balance change (e.g. RewardClaimed)
) {
  const eventTimestamp = await getBlockTimestamp(log.blockNumber);
  // Assuming common event structure: user, lpTokenSymbol, amount
  // Adapt if your events have different parameter names
  const { user, lpTokenSymbol, amount: rawAmount } = log.args;
  const lowerUserAddress = user.toLowerCase();

  console.log(`LP ${recordType} by ${user} for ${lpTokenSymbol} amount ${rawAmount.toString()} at block ${log.blockNumber}`);
  await ensureUserExists(lowerUserAddress, log.transactionHash, log.blockNumber, eventTimestamp);

  const decimalAmount = new Decimal(rawAmount.toString()).div(new Decimal(10).pow(DEFAULT_LP_TOKEN_DECIMALS));

  await db.transaction(async (tx) => {
    // 1. Create LP Record
    await tx.insert(userHyperIndexLpRecords).values({
      id: createId(),
      userWalletAddress: lowerUserAddress,
      lpTokenSymbol: lpTokenSymbol,
      recordType: recordType,
      amount: decimalAmount.toFixed(8),
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber, // Pass bigint directly as per schema for this table
      eventTimestamp: eventTimestamp,
      details: log.args, // Store raw event args if needed
    });

    // 2. Update LP Balance
    if (balanceChangeMultiplier !== 0) {
      const balanceChange = decimalAmount.mul(balanceChangeMultiplier);
      await updateLpBalance(
        tx,
        lowerUserAddress,
        lpTokenSymbol,
        balanceChange,
        log.transactionHash,
        log.blockNumber,
        eventTimestamp
      );
    }
    console.log(`LP ${recordType} recorded for ${lowerUserAddress}, ${lpTokenSymbol}.`);
  });
}

async function handleLpDepositEvent(log: any) {
  await processLpEvent(log, 'DEPOSIT', 1);
}

async function handleLpWithdrawalEvent(log: any) {
  await processLpEvent(log, 'WITHDRAWAL', -1);
}

async function handleLpStakeEvent(log: any) {
  // Assuming staking increases the tracked LP balance (e.g. user transfers LP to staking contract)
  // If staking is a separate balance, multiplier might be 0 here and a new table/logic needed.
  await processLpEvent(log, 'STAKE', 1);
}

async function handleLpUnstakeEvent(log: any) {
  // Assuming unstaking decreases the tracked LP balance
  await processLpEvent(log, 'UNSTAKE', -1);
}

async function handleLpRewardClaimedEvent(log: any) {
  // Typically, claiming rewards doesn't change the LP token balance itself.
  // It creates a record of the reward.
  // The 'amount' in the event would be the reward amount, not LP token amount.
  // If your 'RewardClaimed' event includes LP token amount that changes balance, adjust multiplier.
  await processLpEvent(log, 'REWARD_CLAIMED', 0); // Multiplier 0 as it usually doesn't affect LP balance
}

async function processLogs(logs: any[], eventType: string) {
  console.log(`Processing ${logs.length} ${eventType} logs...`);
  for (const log of logs) {
    try {
      // Assuming log structure from viem includes args, transactionHash, blockNumber
      if (eventType === 'XaumTransfer') {
        await handleXaumTransferEvent(log);
      } else if (eventType === 'LpDeposit') {
        await handleLpDepositEvent(log);
      } else if (eventType === 'LpWithdrawal') {
        await handleLpWithdrawalEvent(log);
      } else if (eventType === 'LpStake') {
        await handleLpStakeEvent(log);
      } else if (eventType === 'LpUnstake') {
        await handleLpUnstakeEvent(log);
      } else if (eventType === 'LpRewardClaimed') {
        await handleLpRewardClaimedEvent(log);
      }
      // Add other event types as needed
    } catch (error) {
      console.error(`Error processing ${eventType} log (tx: ${log.transactionHash}, block: ${log.blockNumber}):`, error);
      // Decide on error handling: skip, retry, halt, etc.
    }
  }
}

async function syncHistoricalEvents() {
  console.log("Starting historical event synchronization...");

  // In a real app, load lastProcessedBlock from a persistent store (e.g., database)
  // For this example, we'll use the in-memory variable or START_BLOCK
  let fromBlock = lastProcessedBlock ? lastProcessedBlock + 1n : START_BLOCK;
  if (fromBlock === 0n && START_BLOCK > 0n) fromBlock = START_BLOCK; // Prefer explicit start_block if no last processed

  const latestBlockNumber = await publicClient.getBlockNumber();
  console.log(`Current latest block: ${latestBlockNumber}. Syncing from block: ${fromBlock}`);

  while (fromBlock <= latestBlockNumber) {
    const toBlock = (fromBlock + HISTORICAL_SYNC_BLOCK_INTERVAL - 1n) > latestBlockNumber
      ? latestBlockNumber
      : fromBlock + HISTORICAL_SYNC_BLOCK_INTERVAL - 1n;

    console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);

    // Fetch XAUM Transfers
    const xaumTransferLogs = await publicClient.getLogs({
      address: XAUM_TOKEN_ADDRESS,
      event: XAUM_TOKEN_ABI.find(item => item.type === 'event' && item.name === 'Transfer'), // More robust event finding
      fromBlock: fromBlock,
      toBlock: toBlock,
    });
    await processLogs(xaumTransferLogs, 'XaumTransfer');

    // Fetch LP Manager Events (Deposit, Withdrawal, Stake, Unstake, RewardClaimed)
    // You might want to fetch all events for a contract in one go if possible, or iterate
    const lpManagerEventsToFetch = ['Deposit', 'Withdrawal', 'Stake', 'Unstake', 'RewardClaimed'];
    for (const eventName of lpManagerEventsToFetch) {
      const eventAbiItem = HYPERINDEX_LP_MANAGER_ABI.find(item => item.type === 'event' && item.name === eventName);
      if (eventAbiItem) {
        const lpManagerLogs = await publicClient.getLogs({
          address: HYPERINDEX_LP_MANAGER_ADDRESS,
          event: eventAbiItem,
          fromBlock: fromBlock,
          toBlock: toBlock,
        });
        await processLogs(lpManagerLogs, `Lp${eventName}`);
      }
    }

    // Persistently store `toBlock` as the new `lastProcessedBlock`
    lastProcessedBlock = toBlock;
    console.log(`Successfully processed events up to block ${lastProcessedBlock}.`);
    // In a real app: await db.update(...).set({ lastProcessedBlock: lastProcessedBlock.toString() });

    fromBlock = toBlock + 1n;

    // Optional: Add a small delay to avoid rate-limiting
    // await new Promise(resolve => setTimeout(resolve, 200));
  }
  console.log("Historical event synchronization complete.");
}


export async function startChainScanner(skipHistoricalSync = false) {
  if (!skipHistoricalSync) {
    try {
      await syncHistoricalEvents();
    } catch (error) {
      console.error("Critical error during historical sync. Scanner might not start real-time watching.", error);
      // Depending on the error, you might want to exit or retry
      return; // Or throw
    }
  } else {
    console.log("Skipping historical event synchronization.");
  }

  console.log("Starting chain scanner...");

  // --- Watch XAUM Token Transfers ---
  publicClient.watchContractEvent({
    address: XAUM_TOKEN_ADDRESS,
    abi: XAUM_TOKEN_ABI,
    eventName: 'Transfer',
    pollingInterval: 4000, // Optional: Adjust polling interval if not using WebSockets
    onLogs: logs => logs.forEach(log => handleXaumTransferEvent(log).catch(console.error)),
    onError: error => console.error("Error watching XAUM Transfers:", error),
  });

  // --- Watch HyperIndex LP Manager Events (Deposit example) ---
  publicClient.watchContractEvent({
    address: HYPERINDEX_LP_MANAGER_ADDRESS,
    abi: HYPERINDEX_LP_MANAGER_ABI,
    eventName: 'Deposit',
    pollingInterval: 4000,
    onLogs: logs => logs.forEach(log => handleLpDepositEvent(log).catch(console.error)),
    onError: error => console.error("Error watching LP Deposits:", error),
  });
  publicClient.watchContractEvent({
    address: HYPERINDEX_LP_MANAGER_ADDRESS,
    abi: HYPERINDEX_LP_MANAGER_ABI,
    eventName: 'Withdrawal',
    pollingInterval: 4000,
    onLogs: logs => logs.forEach(log => handleLpWithdrawalEvent(log).catch(console.error)),
    onError: error => console.error("Error watching LP Withdrawals:", error),
  });
  publicClient.watchContractEvent({
    address: HYPERINDEX_LP_MANAGER_ADDRESS,
    abi: HYPERINDEX_LP_MANAGER_ABI, // Ensure Stake event is in this ABI
    eventName: 'Stake', // Replace with your actual event name if different
    pollingInterval: 4000,
    onLogs: logs => logs.forEach(log => handleLpStakeEvent(log).catch(console.error)),
    onError: error => console.error("Error watching LP Stakes:", error),
  });
  publicClient.watchContractEvent({
    address: HYPERINDEX_LP_MANAGER_ADDRESS,
    abi: HYPERINDEX_LP_MANAGER_ABI, // Ensure Unstake event is in this ABI
    eventName: 'Unstake', // Replace with your actual event name if different
    pollingInterval: 4000,
    onLogs: logs => logs.forEach(log => handleLpUnstakeEvent(log).catch(console.error)),
    onError: error => console.error("Error watching LP Unstakes:", error),
  });

  // Add more watchers for other events and contracts (e.g., individual LP token Transfer events)

  console.log("Chain scanner is watching for events.");
  // Keep the script running, e.g. if this is a standalone service
  // For a Next.js app, you might run this as a background task or a separate process.
  publicClient.watchContractEvent({
    address: HYPERINDEX_LP_MANAGER_ADDRESS,
    abi: HYPERINDEX_LP_MANAGER_ABI, // Ensure RewardClaimed event is in this ABI
    eventName: 'RewardClaimed', // Replace with your actual event name if different
    pollingInterval: 4000,
    onLogs: logs => logs.forEach(log => handleLpRewardClaimedEvent(log).catch(console.error)),
    onError: error => console.error("Error watching LP Reward Claims:", error),
  });
}

// To run this scanner (e.g., in a separate script or a long-running API route for testing):
// if (require.main === module) { // If run directly
//   startChainScanner().catch(console.error);
// }

// Considerations for production:
// 1. Starting Block: For initial sync, you'll need to fetch historical logs using `publicClient.getLogs()`
//    from a specific `fromBlock` up to `toBlock` (current block), then start watching.
// 2. Last Processed Block: Store the last successfully processed block number in your DB to resume
//    from there in case of restarts.
// 3. Reorg Handling: Blockchain reorgs can happen. More advanced scanners might detect reorgs
//    and revert/re-process blocks. Viem's `watchContractEvent` has some built-in handling for this.
// 4. Error Handling & Retries: Robust error handling for RPC calls and DB operations.
// 5. Batching: For historical sync, batch `getLogs` calls and DB inserts.
// 6. Scalability: For many contracts or high event volume, consider a more distributed architecture.

async function main() {
  // Load .env variables if not already loaded by a framework
  // import * as dotenv from 'dotenv';
  // dotenv.config({ path: '.env' }); // Adjust path if needed

  await startChainScanner(process.env.SKIP_HISTORICAL_SYNC === 'true');
  console.log("Chain scanner initiated. It will keep running to listen for new events.");
  // Keep the process alive
  return new Promise(() => {});
}

if (process.env.RUN_SCANNER === 'true') { // Control execution via an env variable
  main().catch(error => {
    console.error("Scanner failed to start or crashed:", error);
    process.exit(1);
  });
}
