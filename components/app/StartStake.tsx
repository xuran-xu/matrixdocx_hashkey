import { useRef, useState, useEffect } from 'react';
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

  // 从URL参数中获取默认选择的质押类型
  useEffect(() => {
    // 获取URL参数
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('upgradestakes');
    console.log(typeParam, 'typeParamtypeParamtypeParamtypeParam');
    console.log(activeLockedStakes, 'activeLockedStakes');
    if (typeParam && activeLockedStakes > 0) {
      setTimeout(() => {
        handleClick();
      }, 200);
    }
  }, [activeLockedStakes]);

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
  const handleClick = () => {
    modalRef.current!.openModal(unStakeAllAndNewStake);
  };

  return (
    <>
      <div className="mt-10">
        {address && activeLockedStakes > 0 ? (
          <div 
            onClick={handleClick}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-primary/80 text-white hover:bg-primary transition-colors text-lg font-medium shadow-lg hover:shadow-xl cursor-pointer"
          >
            One-click profit increases
            <svg className="w-5 h-5 ml-2 coin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l3-3 3 3 3-3 3 3 3-3 3 3" />
              <path d="M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8" />
              <circle cx="10" cy="6" r="1" className="coin coin-1" fill="gold" />
              <circle cx="12" cy="6" r="1" className="coin coin-2" fill="gold" />
              <circle cx="14" cy="6" r="1" className="coin coin-3" fill="gold" />
            </svg>
          </div>
        ) : (
          <Link 
            href="/stake" 
            className="inline-flex items-center px-8 py-4 rounded-xl bg-primary/80 text-white hover:bg-primary transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
          >
            Start Staking
            <svg className="w-5 h-5 ml-2 coin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l3-3 3 3 3-3 3 3 3-3 3 3" />
              <path d="M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8" />
              <circle cx="10" cy="6" r="1" className="coin coin-1" fill="gold" />
              <circle cx="12" cy="6" r="1" className="coin coin-2" fill="gold" />
              <circle cx="14" cy="6" r="1" className="coin coin-3" fill="gold" />
            </svg>
          </Link>
        )}
      </div>
      <Modal ref={modalRef} activeLockedStakes={Number(activeLockedStakes)} progressStep={progress} isStakeSuccess={isStakeSuccess}/>
    </>
  );
}