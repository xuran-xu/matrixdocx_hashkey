'use client';

import { useState, useEffect, useCallback } from 'react';
import { LpDailySnapshotRequestBody, LpDailySnapshotItem } from '@/types/hyperIndex';

export type LpDailySnapshotResponse = LpDailySnapshotItem[];

const API_URL = 'https://api.hyperindex.trade/api/explore/lp-daily-snapshot';

export function useLpDailySnapshot(pairAddress?: string, walletAddress?: string) {
  const [data, setData] = useState<LpDailySnapshotResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(0);

  const refetch = useCallback(() => {
    setTriggerFetch(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!pairAddress || !walletAddress) {
        setData(null); // Reset data if addresses are not available
        // Optionally set isLoading to false if you don't want a loading state when params are missing
        // setIsLoading(false); 
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requestBody: LpDailySnapshotRequestBody = {
          pairAddress,
          walletAddress,
        };

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          let errorData = 'Failed to fetch data';
          try {
            // Attempt to parse error response from API if it's JSON
            const errJson = await response.json();
            errorData = errJson.message || errJson.error || JSON.stringify(errJson);
          } catch (e) {
            // Fallback to text if not JSON
            errorData = await response.text() || response.statusText;
          }
          throw new Error(`HTTP error ${response.status}: ${errorData}`);
        }

        const result: LpDailySnapshotResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred while fetching LP daily snapshot.'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pairAddress, walletAddress, triggerFetch]);

  return { data, isLoading, error, refetch };
}