import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '@/drizzle/schema';
import { getCurrentBlockNumber, getUserXaumBalance } from './utils/web3Util';
import {
  getLastScannerState,
  updateScannerState,
  insertUserXaumBalanceSnapshot,
  insertUserXaumYield,
} from './chainScanner';

const CONFIRMATION_DELAY = 12;
const SCANNER_ID = 'xaum_balance_scanner';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function getAllUserAddresses(): Promise<string[]> {
  const result = await db.select({ walletAddress: users.walletAddress }).from(users);
  return result.map(r => r.walletAddress);
}

// 新增：获取连续持仓天数的函数（实际应根据业务逻辑实现，这里简单示例）
async function getContinuousHoldingDays(db: any, address: string, snapshotDate: string): Promise<number> {
  // 查询前一天的快照
  const prev = await db.query.userXaumBalanceSnapshots.findFirst({
    where: (snap, { eq, and }) =>
      and(
        eq(snap.userWalletAddress, address),
        eq(snap.snapshotDate, new Date(Date.parse(snapshotDate) - 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
      ),
  });
  // 如果前一天有余额且大于0，则+1，否则为1
  return prev && Number(prev.balance) > 0
    ? (prev.continuousHoldingDays || 0) + 1
    : 1;
}

async function scanAndSnapshot() {
  const startBlock = BigInt(process.env.START_BLOCK || '0');
  const latestBlock = await getCurrentBlockNumber();
  const targetBlock = latestBlock - BigInt(CONFIRMATION_DELAY);

  const state = await getLastScannerState(db, SCANNER_ID);
  let fromBlock = state?.lastSuccessfullyProcessedBlock ?? BigInt(0);

  if (fromBlock === BigInt(0)) {
    fromBlock = startBlock;
  }

  if (fromBlock >= targetBlock) {
    console.log('No new blocks to scan.');
    return;
  }

  const snapshotDate = new Date().toISOString().slice(0, 10);
  const userAddresses = await getAllUserAddresses();

  for (const address of userAddresses) {
    const balance = await getUserXaumBalance(address, targetBlock);
    const continuousHoldingDays = await getContinuousHoldingDays(db, address, snapshotDate);
    await insertUserXaumBalanceSnapshot(db, address, balance, snapshotDate, continuousHoldingDays);
    await insertUserXaumYield(db, address, snapshotDate, balance, false, null);
  }

  await updateScannerState(db, SCANNER_ID, targetBlock, CONFIRMATION_DELAY);

  console.log(`快照完成，区块: ${targetBlock.toString()}，用户数: ${userAddresses.length}`);
}

scanAndSnapshot()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });