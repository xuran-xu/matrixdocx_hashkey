'use client';

import { useEffect, useState } from 'react';
import { usePublicClient, useChainId } from 'wagmi';
import { getContractAddresses } from '@/config/contracts';
import { 
  createPublicClient, 
  http, 
  parseAbiItem, 
  type PublicClient,
  type Log
} from 'viem';
import { mainnet } from 'viem/chains';

// Define event types based on the contract events
export interface StakeEvent {
  user: `0x${string}`;
  hskAmount: bigint;
  sharesAmount: bigint;
  stakeType: number;
  lockEndTime: bigint;
  stakeId: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
}

export interface UnstakeEvent {
  user: `0x${string}`;
  sharesAmount: bigint;
  hskAmount: bigint;
  isEarlyWithdrawal: boolean;
  penalty: bigint;
  stakeId: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  logIndex: number;
}

export type ContractEvent = StakeEvent | UnstakeEvent;

// Define the expected log types with args
interface StakeLog extends Log {
  args: {
    user: `0x${string}`;
    hskAmount: bigint;
    sharesAmount: bigint;
    stakeType: number;
    lockEndTime: bigint;
    stakeId: bigint;
  };
}

interface UnstakeLog extends Log {
  args: {
    user: `0x${string}`;
    sharesAmount: bigint;
    hskAmount: bigint;
    isEarlyWithdrawal: boolean;
    penalty: bigint;
    stakeId: bigint;
  };
}

// Extend globalThis to include publicClient
declare global {
  interface Window {
    publicClient?: PublicClient;
  }
}

// Constants
const MAX_BLOCK_RANGE = 1000; // Maximum block range allowed by the RPC provider

// Helper function to calculate total difference
const calculateTotalDifference = (events: StakeEvent[]): bigint => {
  return events.reduce((sum, event) => {
    const difference = event.hskAmount - event.sharesAmount;
    return sum + difference;
  }, BigInt(0));
};

// Utility function to convert BigInt to string for Excel compatibility
const convertBigIntToString = (value: bigint | number): string => value.toString();

// Updated exportToExcel function to handle three sheets
export function exportToExcel(
  stakeEvents: StakeEvent[],
  unstakeEvents: UnstakeEvent[],
  activeStakeEvents: StakeEvent[],
  filename: string = 'contract-events.xlsx'
) {
  const XLSX = require('xlsx');

  // Worksheet for Stake Events
  const stakeWorksheet = XLSX.utils.json_to_sheet(
    stakeEvents.map(event => ({
      User: event.user,
      HSK_Amount: convertBigIntToString(event.hskAmount),
      Shares_Amount: convertBigIntToString(event.sharesAmount),
      Stake_Type: event.stakeType,
      Lock_End_Time: convertBigIntToString(event.lockEndTime),
      Stake_ID: convertBigIntToString(event.stakeId),
      Block_Number: convertBigIntToString(event.blockNumber),
      Transaction_Hash: event.transactionHash,
      Log_Index: event.logIndex
    }))
  );

  // Worksheet for Unstake Events
  const unstakeWorksheet = XLSX.utils.json_to_sheet(
    unstakeEvents.map(event => ({
      User: event.user,
      Shares_Amount: convertBigIntToString(event.sharesAmount),
      HSK_Amount: convertBigIntToString(event.hskAmount),
      Is_Early_Withdrawal: event.isEarlyWithdrawal,
      Penalty: convertBigIntToString(event.penalty),
      Stake_ID: convertBigIntToString(event.stakeId),
      Block_Number: convertBigIntToString(event.blockNumber),
      Transaction_Hash: event.transactionHash,
      Log_Index: event.logIndex
    }))
  );

  // Worksheet for Active Stake Events (same format as Stake Events)
  const activeStakeWorksheet = XLSX.utils.json_to_sheet(
    activeStakeEvents.map(event => ({
      User: event.user,
      HSK_Amount: convertBigIntToString(event.hskAmount),
      Shares_Amount: convertBigIntToString(event.sharesAmount),
      Stake_Type: event.stakeType,
      Lock_End_Time: convertBigIntToString(event.lockEndTime),
      Stake_ID: convertBigIntToString(event.stakeId),
      Block_Number: convertBigIntToString(event.blockNumber),
      Transaction_Hash: event.transactionHash,
      Log_Index: event.logIndex
    }))
  );

  // Create workbook and append all three sheets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, stakeWorksheet, 'Stake Events');
  XLSX.utils.book_append_sheet(workbook, unstakeWorksheet, 'Unstake Events');
  XLSX.utils.book_append_sheet(workbook, activeStakeWorksheet, 'Active Stakes');

  // Write the file and trigger download
  XLSX.writeFile(workbook, filename);
}

// Updated useContractEvents hook
export function useContractEvents(
  fromBlock: bigint = 0n,
  toBlock: bigint | 'latest' = 'latest',
  userAddress?: `0x${string}`
) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const contractAddress = getContractAddresses(chainId).stakingOldContract;

  const [stakeEvents, setStakeEvents] = useState<StakeEvent[]>([]);
  const [unstakeEvents, setUnstakeEvents] = useState<UnstakeEvent[]>([]);
  const [activeStakeEvents, setActiveStakeEvents] = useState<StakeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!publicClient || !contractAddress) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setStakeEvents([]);
      setUnstakeEvents([]);
      setActiveStakeEvents([]);

      try {
        // Get the latest block number if toBlock is 'latest'
        let resolvedToBlock: bigint;
        if (toBlock === 'latest') {
          resolvedToBlock = await publicClient.getBlockNumber();
        } else {
          resolvedToBlock = toBlock;
        }

        // Define event filters
        const stakeEventSignature = parseAbiItem('event Stake(address indexed user, uint256 hskAmount, uint256 sharesAmount, uint8 stakeType, uint256 lockEndTime, uint256 stakeId)');
        const unstakeEventSignature = parseAbiItem('event Unstake(address indexed user, uint256 sharesAmount, uint256 hskAmount, bool isEarlyWithdrawal, uint256 penalty, uint256 stakeId)');

        // Prepare arrays to collect all events
        const allStakeEvents: StakeEvent[] = [];
        const allUnstakeEvents: UnstakeEvent[] = [];

        // Fetch events in chunks
        let currentFromBlock = fromBlock;
        while (currentFromBlock <= resolvedToBlock) {
          const chunkToBlock = currentFromBlock + BigInt(MAX_BLOCK_RANGE) > resolvedToBlock 
            ? resolvedToBlock 
            : currentFromBlock + BigInt(MAX_BLOCK_RANGE - 1);

          console.log(`Fetching events from block ${currentFromBlock} to ${chunkToBlock}`);

          const stakeEventFilter = {
            address: contractAddress,
            event: stakeEventSignature,
            fromBlock: currentFromBlock,
            toBlock: chunkToBlock,
            args: userAddress ? { user: userAddress } : undefined,
          };

          const unstakeEventFilter = {
            address: contractAddress,
            event: unstakeEventSignature,
            fromBlock: currentFromBlock,
            toBlock: chunkToBlock,
            args: userAddress ? { user: userAddress } : undefined,
          };

          try {
            const [stakeLogsResult, unstakeLogsResult] = await Promise.all([
              publicClient.getLogs(stakeEventFilter),
              publicClient.getLogs(unstakeEventFilter),
            ]);

            if (stakeLogsResult.length) {
              console.log(stakeLogsResult, 'stakeLogsResult');
            }

            const processedStakeEvents = stakeLogsResult.map(log => {
              const typedLog = log as unknown as StakeLog;
              return {
                user: typedLog.args.user,
                hskAmount: typedLog.args.hskAmount,
                sharesAmount: typedLog.args.sharesAmount,
                stakeType: Number(typedLog.args.stakeType),
                lockEndTime: typedLog.args.lockEndTime,
                stakeId: typedLog.args.stakeId,
                blockNumber: typedLog.blockNumber ?? 0n,
                transactionHash: typedLog.transactionHash ?? '0x0' as `0x${string}`,
                logIndex: typedLog.logIndex ?? 0,
              };
            });

            const processedUnstakeEvents = unstakeLogsResult.map(log => {
              const typedLog = log as unknown as UnstakeLog;
              return {
                user: typedLog.args.user,
                sharesAmount: typedLog.args.sharesAmount,
                hskAmount: typedLog.args.hskAmount,
                isEarlyWithdrawal: typedLog.args.isEarlyWithdrawal,
                penalty: typedLog.args.penalty,
                stakeId: typedLog.args.stakeId,
                blockNumber: typedLog.blockNumber ?? 0n,
                transactionHash: typedLog.transactionHash ?? '0x0' as `0x${string}`,
                logIndex: typedLog.logIndex ?? 0,
              };
            });

            allStakeEvents.push(...processedStakeEvents);
            allUnstakeEvents.push(...processedUnstakeEvents);

            setStakeEvents(prev => [...prev, ...processedStakeEvents]);
            setUnstakeEvents(prev => [...prev, ...processedUnstakeEvents]);
          } catch (chunkError) {
            console.error(`Error fetching events for block range ${currentFromBlock}-${chunkToBlock}:`, chunkError);
          }

          currentFromBlock = chunkToBlock + 1n;
        }

        // Sort events by block number (newest first)
        allStakeEvents.sort((a, b) => Number(b.blockNumber - a.blockNumber));
        allUnstakeEvents.sort((a, b) => Number(b.blockNumber - a.blockNumber));

        // Compute Active Stake Events
        const unstakedKeys = new Set(
          allUnstakeEvents.map(event => `${event.user}-${event.stakeId.toString()}`)
        );
        const activeStakes = allStakeEvents.filter(
          event => !unstakedKeys.has(`${event.user}-${event.stakeId.toString()}`)
        );

        // Set all event states
        setStakeEvents(allStakeEvents);
        setUnstakeEvents(allUnstakeEvents);
        setActiveStakeEvents(activeStakes);

        // Export all three event types to Excel
        setTimeout(() => {
          exportToExcel(allStakeEvents, allUnstakeEvents, activeStakes, 'contract-events.xlsx');
        }, 1000);

        // Calculate total difference
        const totalDifference = calculateTotalDifference(allStakeEvents);
        console.log('Total HSK-Shares difference:', totalDifference.toString());

      } catch (err) {
        console.error('Error fetching contract events:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [publicClient, contractAddress, fromBlock, toBlock, userAddress]);

  return { stakeEvents, unstakeEvents, activeStakeEvents, isLoading, error };
}

// Utility function to fetch contract events (unchanged)
export async function fetchContractEvents(
  contractAddress: `0x${string}`,
  fromBlock: bigint = 4189965n,
  toBlock: bigint | 'latest' = 'latest',
  userAddress?: `0x${string}`,
  rpcUrl?: string
) {
  const client = rpcUrl 
    ? createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
      })
    : undefined;

  const publicClient = client || (typeof window !== 'undefined' ? window.publicClient : undefined);

  if (!publicClient) {
    throw new Error('No public client available. Please provide an RPC URL or ensure a global client exists.');
  }

  try {
    let resolvedToBlock: bigint;
    if (toBlock === 'latest') {
      resolvedToBlock = await publicClient.getBlockNumber();
    } else {
      resolvedToBlock = toBlock;
    }

    const stakeEventSignature = parseAbiItem('event Stake(address indexed user, uint256 hskAmount, uint256 sharesAmount, uint8 stakeType, uint256 lockEndTime, uint256 stakeId)');
    const unstakeEventSignature = parseAbiItem('event Unstake(address indexed user, uint256 sharesAmount, uint256 hskAmount, bool isEarlyWithdrawal, uint256 penalty, uint256 stakeId)');

    const allStakeEvents: StakeEvent[] = [];
    const allUnstakeEvents: UnstakeEvent[] = [];

    let currentFromBlock = fromBlock;
    while (currentFromBlock <= resolvedToBlock) {
      const chunkToBlock = currentFromBlock + BigInt(MAX_BLOCK_RANGE) > resolvedToBlock 
        ? resolvedToBlock 
        : currentFromBlock + BigInt(MAX_BLOCK_RANGE - 1);

      console.log(`Fetching events from block ${currentFromBlock} to ${chunkToBlock}`);

      const stakeEventFilter = {
        address: contractAddress,
        event: stakeEventSignature,
        fromBlock: currentFromBlock,
        toBlock: chunkToBlock,
        args: userAddress ? { user: userAddress } : undefined,
      };

      const unstakeEventFilter = {
        address: contractAddress,
        event: unstakeEventSignature,
        fromBlock: currentFromBlock,
        toBlock: chunkToBlock,
        args: userAddress ? { user: userAddress } : undefined,
      };

      try {
        const [stakeLogsResult, unstakeLogsResult] = await Promise.all([
          publicClient.getLogs(stakeEventFilter),
          publicClient.getLogs(unstakeEventFilter),
        ]);

        const processedStakeEvents = stakeLogsResult.map((log: unknown) => {
          const typedLog = log as unknown as StakeLog;
          return {
            user: typedLog.args.user,
            hskAmount: typedLog.args.hskAmount,
            sharesAmount: typedLog.args.sharesAmount,
            stakeType: Number(typedLog.args.stakeType),
            lockEndTime: typedLog.args.lockEndTime,
            stakeId: typedLog.args.stakeId,
            blockNumber: typedLog.blockNumber ?? 0n,
            transactionHash: typedLog.transactionHash ?? '0x0' as `0x${string}`,
            logIndex: typedLog.logIndex ?? 0,
          };
        });

        const processedUnstakeEvents = unstakeLogsResult.map((log: unknown) => {
          const typedLog = log as unknown as UnstakeLog;
          return {
            user: typedLog.args.user,
            sharesAmount: typedLog.args.sharesAmount,
            hskAmount: typedLog.args.hskAmount,
            isEarlyWithdrawal: typedLog.args.isEarlyWithdrawal,
            penalty: typedLog.args.penalty,
            stakeId: typedLog.args.stakeId,
            blockNumber: typedLog.blockNumber ?? 0n,
            transactionHash: typedLog.transactionHash ?? '0x0' as `0x${string}`,
            logIndex: typedLog.logIndex ?? 0,
          };
        });

        allStakeEvents.push(...processedStakeEvents);
        allUnstakeEvents.push(...processedUnstakeEvents);
      } catch (chunkError) {
        console.error(`Error fetching events for block range ${currentFromBlock}-${chunkToBlock}:`, chunkError);
      }

      currentFromBlock = chunkToBlock + 1n;
    }

    allStakeEvents.sort((a, b) => Number(b.blockNumber - a.blockNumber));
    allUnstakeEvents.sort((a, b) => Number(b.blockNumber - a.blockNumber));

    return { stakeEvents: allStakeEvents, unstakeEvents: allUnstakeEvents };
  } catch (err) {
    console.error('Error fetching contract events:', err);
    throw err;
  }
}