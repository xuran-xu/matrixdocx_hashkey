'use client';

import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { getContractAddresses } from '@/config/contracts';
import { ERC20ABI } from '@/constants/abi';
import { useState, useEffect, useCallback } from 'react';

// Configuration for the tokens whose balances we want to fetch.
const TOKENS_CONFIG = [
  { stateKey: 'xaum' as const, contractKey: 'XAUMToken' as const, name: 'XAUM' },
  { stateKey: 'usdt' as const, contractKey: 'USDTToken' as const, name: 'USDT' },
  { stateKey: 'usdc' as const, contractKey: 'USDCToken' as const, name: 'USDC' },
];

// Dynamically create keys for ERC20 tokens from TOKENS_CONFIG
type ERC20TokenKey = typeof TOKENS_CONFIG[number]['stateKey'];

// Define the structure for balances, including HSK (native) and all ERC20 tokens
type BalancesState = Record<ERC20TokenKey, bigint> & {
  hsk: bigint;
};

// Create initial balances dynamically
const initialErc20Balances = TOKENS_CONFIG.reduce((acc, token) => {
  acc[token.stateKey] = BigInt(0);
  return acc;
}, {} as Record<ERC20TokenKey, bigint>);

const initialBalancesState: BalancesState = {
  ...initialErc20Balances,
  hsk: BigInt(0),
};

// Define types for promise outcomes
type ConfiguredTokenInfo = typeof TOKENS_CONFIG[number];

type FulfilledNativeResult = { type: 'native'; value: bigint };
type FulfilledERC20Result = { type: 'erc20'; tokenInfo: ConfiguredTokenInfo; value: bigint };
type FulfilledPromiseResult = FulfilledNativeResult | FulfilledERC20Result;

type RejectedNativeReason = { type: 'native'; reason: Error };
type RejectedERC20Reason = { type: 'erc20'; tokenInfo: ConfiguredTokenInfo; reason: Error };
type RejectedPromiseReason = RejectedNativeReason | RejectedERC20Reason;

export function useTokenBalances() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const [balances, setBalances] = useState<BalancesState>(initialBalancesState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(0); // Used to manually trigger a refetch

  const refetch = useCallback(() => {
    setTriggerFetch(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Renamed to avoid potential naming conflicts if `refetch` was named `fetchBalances`
    const fetchBalancesAsync = async () => {
      // Ensure address, publicClient, and chainId are available.
      // These are checked in the calling condition.
      setIsLoading(true); // Set loading true at the start of each fetch attempt
      setError(null); // Reset error at the beginning of a fetch attempt

      const defaultBalances: BalancesState = { ...initialBalancesState };

      try {
        const contractAddrs = getContractAddresses(chainId!); // chainId is guaranteed by the calling condition
        
        const promisesToSettle = [];

        // 1. Native (HSK) balance promise
        promisesToSettle.push(
          publicClient!.getBalance({ address: address! }) // publicClient and address are guaranteed
            .then(value => ({ type: 'native' as const, value } as FulfilledNativeResult))
            .catch(reason => { throw { type: 'native' as const, reason: reason instanceof Error ? reason : new Error(String(reason)) } as RejectedNativeReason; })
        );

        // 2. ERC20 token balance promises
        TOKENS_CONFIG.forEach(tokenInfo => {
            const tokenAddress = contractAddrs[tokenInfo.contractKey];
            if (!tokenAddress) {
              const errMsg = `Address for ${tokenInfo.name} (${tokenInfo.contractKey}) not found on chain ${chainId!}.`;
              console.warn(errMsg);
              // Create a rejected promise to be handled by allSettled
              promisesToSettle.push(Promise.reject({ type: 'erc20' as const, tokenInfo, reason: new Error(errMsg) } as RejectedERC20Reason));
            } else {
              promisesToSettle.push(
                publicClient!.readContract({ // publicClient is guaranteed
                  address: tokenAddress,
                  abi: ERC20ABI,
                  functionName: 'balanceOf',
                  args: [address!], // address is guaranteed
                })
                .then(value => ({ type: 'erc20' as const, tokenInfo, value: value as bigint } as FulfilledERC20Result))
                .catch(reason => { throw { type: 'erc20' as const, tokenInfo, reason: reason instanceof Error ? reason : new Error(String(reason)) } as RejectedERC20Reason; })
              );
            }
          });

        const settledResults = await Promise.allSettled<FulfilledPromiseResult>(promisesToSettle);

        const updatedBalances = { ...defaultBalances };
        let firstErrorEncountered: Error | null = null;

        settledResults.forEach(result => {
          if (result.status === 'fulfilled') {
            const fulfilledValue = result.value;
            if (fulfilledValue.type === 'native') {
              updatedBalances.hsk = fulfilledValue.value;
            } else { // type must be 'erc20'
              updatedBalances[fulfilledValue.tokenInfo.stateKey] = fulfilledValue.value;
            }
          } else { // status === 'rejected'
            // result.reason is 'any' from Promise.allSettled, so we cast based on our thrown objects
            const rejection = result.reason as RejectedPromiseReason; 
            const errorToReport = rejection.reason; // This is already an Error object due to our catch blocks

            if (rejection.type === 'native') {
              console.error(`Failed to fetch native balance (HSK):`, errorToReport);
              updatedBalances.hsk = BigInt(0); // Default to 0 on error
            } else { // type must be 'erc20'
              console.error(`Failed to fetch balance for ${rejection.tokenInfo.name}:`, errorToReport);
              updatedBalances[rejection.tokenInfo.stateKey] = BigInt(0); // Default to 0 on error for this token
            }

            if (!firstErrorEncountered) { // Capture the first error encountered
              firstErrorEncountered = errorToReport;
            }
          }
        });
        
        setBalances(updatedBalances);
        if (firstErrorEncountered) {
          setError(firstErrorEncountered);
        }
      } catch (err) {
        // This catch block is for unexpected errors during the setup phase (e.g., getContractAddresses fails)
        console.error('An unexpected error occurred during the balance fetching process:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred during balance fetching'));
        setBalances(defaultBalances); // Reset all balances
      } finally {
        setIsLoading(false);
      }
    };

    if (address && publicClient && chainId) {
        fetchBalancesAsync();
    } else {
        // Not enough info to fetch, ensure loading is false and balances are at default
        setIsLoading(false);
        setBalances(initialBalancesState);
        setError(null);
    }
  }, [address, chainId, publicClient, triggerFetch]); // Added triggerFetch to dependencies

  // 定期刷新数据 - Auto-refresh data every 5 minutes
  useEffect(() => {
    if (address && publicClient && chainId) {
      const intervalId = setInterval(() => {
        refetch();
      }, 300000); // 300000 ms = 5 minutes

      return () => clearInterval(intervalId); // Cleanup interval on unmount or when dependencies change
    }
  }, [address, publicClient, chainId, refetch]); // Dependencies for setting up/tearing down the interval

  return { ...balances, isLoading, error, refetch };
}
