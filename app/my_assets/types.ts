export interface StakingProject {
  id: string;
  name: string;
  logo: string;
  apy: number;
  stakedAmount: number;
  status: 'active' | 'ended';
  holdingTime: number; // 以秒为单位
  currentReward: number;
  nextClaimTime: Date;
  totalReward: number;
}

export interface TotalEarnings {
  totalStaked: number;
  holdingPeriod: string;  // 新增
  currentReward: number;
  rewardRate: string;     // 新增
  nextClaimTime: Date;    // 新增
  totalReward: number;
  projectNames: string[]; // 新增
}

export interface StakeRecord {
  id: string;
  projectName: string;
  amount: number;
  timestamp: Date;
  type: 'claim' | 'stake' | 'unstake';
  status: 'completed' | 'pending';
}
