// src/graphql/queries.ts
import { gql } from '@apollo/client';

// 获取用户质押历史的查询 - 修改查询以匹配实际的subgraph schema
export const GET_USER_STAKING_HISTORY = gql`
  query GetUserStakingHistory($userAddress: String!) {
    stakes(where: { user: $userAddress }, orderBy: stakedAt, orderDirection: desc) {
      id
      stakeId
      user
      sharesAmount
      hskAmount
      currentHskValue
      lockEndTime
      stakeType
      isWithdrawn
      unstakeAmount
      profit
      penalty
      isEarlyWithdrawal
      stakedAt
      unstakeAt
    }
    userStats: userStat(id: $userAddress) {
      id
      totalStaked
      totalUnstaked
      totalRewards
    }
  }
`;

// 定义类型
export interface StakeEntity {
  id: string;
  stakeId: string;
  user: string;
  sharesAmount: string;
  hskAmount: string;
  currentHskValue?: string;
  lockEndTime: string;
  stakeType: number;
  isWithdrawn: boolean;
  unstakeAmount?: string;
  profit?: string;
  penalty?: string;
  isEarlyWithdrawal?: boolean;
  stakedAt: string;
  unstakeAt?: string;
}

export interface UserStat {
  id: string;
  totalStaked: string;
  totalUnstaked: string;
  totalRewards: string;
}

export interface StakingHistoryData {
  stakes: StakeEntity[];
  userStats: UserStat | null;
}

export interface StakingHistoryVars {
  userAddress: string;
}