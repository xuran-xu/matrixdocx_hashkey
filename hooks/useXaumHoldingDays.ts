// /home/leo/work/hashkey/matrixdocx_hashkey/hooks/useXaumHoldingDays.ts
'use client';

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useChainId } from 'wagmi';
import { useTokenBalances } from './useBalance';
import { getContractAddresses } from '@/config/contracts';
import { parseAbiItem, type Address as ViemAddress } from 'viem';

const XAUM_TRANSFER_EVENT_ABI = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
);

export function useXaumHoldingDays() {
  const { address } = useAccount();
  const { xaum, isLoading: isBalanceLoading, error: balanceError } = useTokenBalances();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  const [holdingDays, setHoldingDays] = useState<number>(0);
  const [hookError, setHookError] = useState<Error | null>(null);
  const [isCalculating, setIsCalculating] = useState(true); // For log fetching or initial calculation

  useEffect(() => {
    if (!address) {
      setHoldingDays(0);
      setHookError(null);
      setIsCalculating(false);
      return;
    }

    if (isBalanceLoading) {
      setIsCalculating(true); // Balances are loading, so we are also calculating
      return;
    }

    if (balanceError) {
      setHookError(balanceError);
      setHoldingDays(0);
      setIsCalculating(false);
      return;
    }

    if (xaum === BigInt(0)) {
      setHoldingDays(0);
      setHookError(null);
      setIsCalculating(false);
      return;
    }

    // xaum > BigInt(0)
    // Always try to fetch the first transfer event as localStorage is not used.
    setIsCalculating(true);
    const fetchFirstTransfer = async () => {
      if (!publicClient || !chainId) {
        setHookError(new Error('Public client or chain ID not available.'));
        setIsCalculating(false);
        setHoldingDays(0);
        return;
      }

      const contractAddrs = getContractAddresses(chainId);
      const xaumTokenAddress = contractAddrs?.XAUMToken;

      if (!xaumTokenAddress) {
        setHookError(new Error(`XAUM token address not found for chain ${chainId}.`));
        setHoldingDays(0);
        setIsCalculating(false);
        return;
      }

      try {
        // Fetching logs from block 0n can be very resource-intensive and slow for the RPC provider.
        // In a production environment, consider:
        // 1. Using a known deployment block number for the XAUM token if available.
        // 2. Implementing batched fetching in reverse chronological order.
        // 3. Utilizing a dedicated indexing service (e.g., The Graph).
        // For this example, we proceed with fromBlock: 0n with this caveat.
        const logs = await publicClient.getLogs({
          address: xaumTokenAddress,
          event: XAUM_TRANSFER_EVENT_ABI,
          args: {
            to: address as ViemAddress,
          },
          fromBlock: BigInt(0), // Consider optimizing this in production
          toBlock: 'latest',
        });

        if (logs.length > 0) {
          logs.sort((a, b) => {
            if (a.blockNumber === null || b.blockNumber === null) return 0;
            if (a.blockNumber < b.blockNumber) return -1;
            if (a.blockNumber > b.blockNumber) return 1;
            if (a.logIndex === null || b.logIndex === null) return 0;
            if (a.logIndex < b.logIndex) return -1;
            if (a.logIndex > b.logIndex) return 1;
            return 0;
          });

          const firstTransferLog = logs[0];
          if (firstTransferLog.blockNumber) {
            const block = await publicClient.getBlock({ blockNumber: firstTransferLog.blockNumber });
            const firstTransferTimestamp = Number(block.timestamp) * 1000;
            const now = Date.now();
            const diffMilliseconds = now - firstTransferTimestamp;
            // debugger;
            const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
            setHoldingDays(diffDays >= 0 ? diffDays : 0);
            setHookError(null);
          } else {
            setHoldingDays(0);
            setHookError(new Error('First transfer log missing block number.'));
          }
        } else {
          // No transfer events found for the user.
          setHoldingDays(0);
          setHookError(null); // No error, just no holding history from transfers.
        }
      } catch (err) {
        console.error('Error fetching XAUM transfer logs:', err);
        setHookError(err instanceof Error ? err : new Error('Failed to fetch transfer logs.'));
        setHoldingDays(0);
      } finally {
        setIsCalculating(false);
      }
    };

    fetchFirstTransfer();
  }, [address, xaum, isBalanceLoading, balanceError, publicClient, chainId]);

  const overallLoading = isBalanceLoading || isCalculating;

  return {
    holdingDays,
    isLoading: overallLoading,
    error: hookError || balanceError,
  };
}
