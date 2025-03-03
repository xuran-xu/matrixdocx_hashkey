import { gql } from '@apollo/client';

export const GET_USER_STAKING_HISTORY = gql`
  query GetUserStakingHistory($userAddress: String!) {
    stakes(
      where: { user: $userAddress }, 
      orderBy: stakedAt, 
      orderDirection: desc
    ) {
      id
      transactionHash
      stakeId
      user {
        id
      }
      hskAmount
      sharesAmount
      stakeType
      lockEndTime
      
      unstakeTransactionHash
      unstakeAmount
      isWithdrawn
      isEarlyWithdrawal
      penalty
      
      stakedAt
      unstakeAt
      
      currentHskValue
      profit
    }
    
    tokenTransfers(
      where: { 
        or: [
          { from: $userAddress },
          { to: $userAddress }
        ]
      }, 
      orderBy: blockTimestamp, 
      orderDirection: desc
    ) {
      id
      token
      from
      to
      amount
      transactionHash
      blockNumber
      blockTimestamp
    }
    
    user(id: $userAddress) {
      totalStaked
      totalUnstaked
      totalRewards
    }
  }
`;

export interface TokenTransfer {
  id: string;
  token: string;
  from: string;
  to: string;
  amount: string;
  transactionHash: string;
  blockNumber: string;
  blockTimestamp: string;
}

export interface StakeEntity {
  id: string;
  transactionHash: string;
  stakeId: string;
  user: { id: string };
  hskAmount: string;
  sharesAmount: string;
  stakeType: number;
  lockEndTime: string;
  
  unstakeTransactionHash?: string;
  unstakeAmount?: string;
  isWithdrawn: boolean;
  isEarlyWithdrawal?: boolean;
  penalty?: string;
  
  stakedAt: string;
  unstakeAt?: string;
  
  currentHskValue?: string;
  profit?: string;
}

export interface UserStats {
  totalStaked: string;
  totalUnstaked: string;
  totalRewards: string;
}

export interface StakingHistoryData {
  stakes: StakeEntity[];
  tokenTransfers: TokenTransfer[];
  user: UserStats;
}

export interface StakingHistoryVars {
  userAddress: string;
}