import { useRef, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useBatchUnstakeLocked, useUserStakingInfo } from '@/hooks/useOldStakingContracts';
import { useStakeLocked, useStakingInfo, useAllStakingAPRs } from '@/hooks/useStakingContracts';
import Modal from './StakeModal';
import { StakeType } from '@/types/contracts';
import { formatEther } from 'viem';

export default function StartStake() {
  // check user is staked is active
  const { activeLockedStakes } = useUserStakingInfo();
  const { startbatchUnstake, progress } = useBatchUnstakeLocked();
  const { address } = useAccount();
  const modalRef = useRef<{ openModal: (fn: any) => void }>(null);
  const [isStakeSuccess, setIsStakeSuccess] = useState(false);
  const { 
    stakeLocked, 
    isPending,
    isConfirming,
  } = useStakeLocked();

  // 一键提取 并且 质押新的
  const unStakeAllAndNewStake = async (stakeTypeNumber: StakeType) => {
    try {
      setIsStakeSuccess(false);
      // Remove progress watcher and manual updates
      const result = await startbatchUnstake();
      console.log(result, 'startbatchUnstake completed');
      // 这里如果成功继续搞新的
      // 如果失败，则那条会有重试功能
      // @ts-ignore
      const amount = formatEther(result!.totalStaked);
      console.log(amount, 'amount amountamountamountamountamount');
      console.log(stakeTypeNumber, ' stakeTypeNumber ');
      const isStakeSuccess = await stakeLocked(amount, stakeTypeNumber);
      console.log(isStakeSuccess, 'isStakeSuccess isStakeSuccess');
      setIsStakeSuccess(true);
      return isStakeSuccess;
    } catch (error) {
      console.error('Failed to process unstaking:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="mt-10">
        {address && activeLockedStakes > 0 ? (
          <div 
            onClick={() => {
              modalRef.current!.openModal(unStakeAllAndNewStake)
            }}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-primary/80 text-white hover:bg-primary transition-colors text-lg font-medium shadow-lg hover:shadow-xl cursor-pointer"
          >
            One-click profit increases
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg> 
          </div>
        ) : (
          <Link 
            href="/stake" 
            className="inline-flex items-center px-8 py-4 rounded-xl bg-primary/80 text-white hover:bg-primary transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
          >
            Start Staking
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        )}
      </div>
      <Modal ref={modalRef} activeLockedStakes={Number(activeLockedStakes)} progressStep={progress} isStakeSuccess={isStakeSuccess}/>
    </>
  );
}