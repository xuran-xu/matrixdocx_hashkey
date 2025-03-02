import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import {
  AnnualBudgetUpdated as AnnualBudgetUpdatedEvent,
  EarlyWithdrawalPenaltyUpdated as EarlyWithdrawalPenaltyUpdatedEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  ExchangeRateUpdated as ExchangeRateUpdatedEvent,
  HskPerBlockUpdated as HskPerBlockUpdatedEvent,
  Initialized as InitializedEvent,
  InsufficientRewards as InsufficientRewardsEvent,
  MaxHskPerBlockUpdated as MaxHskPerBlockUpdatedEvent,
  MinStakeAmountUpdated as MinStakeAmountUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  RewardsAdded as RewardsAddedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Stake as StakeEvent,
  StakingBonusUpdated as StakingBonusUpdatedEvent,
  StakingContractUpgraded as StakingContractUpgradedEvent,
  Unpaused as UnpausedEvent,
  Unstake as UnstakeEvent,
} from "../generated/HashKeyChainStaking/HashKeyChainStaking"

import {
  Transfer as TransferEvent
} from "../generated/StHSK/StHSK";

import {
  AnnualBudgetUpdated,
  EarlyWithdrawalPenaltyUpdated,
  EmergencyWithdraw,
  ExchangeRateUpdated,
  HskPerBlockUpdated,
  Initialized,
  InsufficientRewards,
  MaxHskPerBlockUpdated,
  MinStakeAmountUpdated,
  OwnershipTransferred,
  Paused,
  RewardsAdded,
  RewardsClaimed,
  Stake,
  StakingBonusUpdated,
  StakingContractUpgraded,
  TokenTransfer,
  Unpaused,
  Unstake,
  User
} from "../generated/schema"

export function getOrCreateUser(userAddress: Address): User {
  let user = User.load(userAddress.toHexString())
  if (!user) {
    user = new User(userAddress.toHexString())
    user.totalStaked = BigInt.zero()
    user.totalUnstaked = BigInt.zero()
    user.totalRewards = BigInt.zero()
    user.save()
  }
  return user
}

// 添加日志记录，帮助调试
function logEventProcessing(eventName: string, txHash: string, user: string): void {
  log.info(
    "处理 {} 事件: 交易哈希={}, 用户={}",
    [eventName, txHash, user]
  )
}

export function handleAnnualBudgetUpdated(
  event: AnnualBudgetUpdatedEvent
): void {
  let entity = new AnnualBudgetUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.oldValue = event.params.oldValue
  entity.newValue = event.params.newValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEarlyWithdrawalPenaltyUpdated(
  event: EarlyWithdrawalPenaltyUpdatedEvent
): void {
  let entity = new EarlyWithdrawalPenaltyUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.stakeType = event.params.stakeType
  entity.oldValue = event.params.oldValue
  entity.newValue = event.params.newValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let entity = new EmergencyWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  entity.user = event.params.user
  entity.sharesAmount = event.params.sharesAmount
  entity.hskAmount = event.params.hskAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExchangeRateUpdated(
  event: ExchangeRateUpdatedEvent
): void {
  let entity = new ExchangeRateUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.totalPooledHSK = event.params.totalPooledHSK
  entity.totalShares = event.params.totalShares
  entity.newRate = event.params.newRate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleHskPerBlockUpdated(event: HskPerBlockUpdatedEvent): void {
  let entity = new HskPerBlockUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldValue = event.params.oldValue
  entity.newValue = event.params.newValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInsufficientRewards(
  event: InsufficientRewardsEvent
): void {
  let entity = new InsufficientRewards(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.required = event.params.required
  entity.available = event.params.available

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMaxHskPerBlockUpdated(
  event: MaxHskPerBlockUpdatedEvent
): void {
  let entity = new MaxHskPerBlockUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldValue = event.params.oldValue
  entity.newValue = event.params.newValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMinStakeAmountUpdated(
  event: MinStakeAmountUpdatedEvent
): void {
  let entity = new MinStakeAmountUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldValue = event.params.oldValue
  entity.newValue = event.params.newValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardsAdded(event: RewardsAddedEvent): void {
  let entity = new RewardsAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount
  entity.from = event.params.from

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let entity = new RewardsClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStake(event: StakeEvent): void {
  logEventProcessing("Stake", event.transaction.hash.toHexString(), event.params.user.toHexString())
  log.info(
    "处理 Stake 事件: 交易哈希={}, 用户={}, 区块号={}, 金额={}, StakeID={}",
    [
      event.transaction.hash.toHexString(),
      event.params.user.toHexString(),
      event.block.number.toString(),
      event.params.hskAmount.toString(),
      event.params.stakeId.toString()
    ]
  )
  let user = getOrCreateUser(event.params.user)
  
  // Update user's totalStaked amount
  user.totalStaked = user.totalStaked.plus(event.params.hskAmount)
  user.save()

  // Create a new stake entity with all required fields
  let stake = new Stake(
    event.params.stakeId.toString()
  )
  stake.user = user.id
  stake.stakeId = event.params.stakeId
  stake.hskAmount = event.params.hskAmount
  stake.sharesAmount = event.params.sharesAmount
  stake.stakeType = event.params.stakeType
  stake.lockEndTime = event.params.lockEndTime
  stake.blockNumber = event.block.number
  stake.blockTimestamp = event.block.timestamp
  stake.transactionHash = event.transaction.hash
  stake.stakedAt = event.block.timestamp
  stake.isWithdrawn = false
  stake.currentHskValue = event.params.hskAmount // Initial value is the same as staked amount
  
  // Determine if this is a locked stake based on stakeType
  // You may need to adjust this logic based on your contract's implementation
  // Assuming stakeType > 0 means it's a locked stake
  stake.isLocked = event.params.stakeType > 0
  
  stake.save()
}

export function handleStakingBonusUpdated(
  event: StakingBonusUpdatedEvent
): void {
  let entity = new StakingBonusUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.stakeType = event.params.stakeType
  entity.oldValue = event.params.oldValue
  entity.newValue = event.params.newValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStakingContractUpgraded(
  event: StakingContractUpgradedEvent
): void {
  let entity = new StakingContractUpgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newVersion = event.params.newVersion

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnstake(event: UnstakeEvent): void {
  logEventProcessing("Unstake", event.transaction.hash.toHexString(), event.params.user.toHexString())
  
  // Update the user's totalUnstaked amount
  let user = getOrCreateUser(event.params.user)
  user.totalUnstaked = user.totalUnstaked.plus(event.params.hskAmount)
  
  // Calculate any rewards
  const reward = event.params.hskAmount.minus(event.params.penalty)
  user.totalRewards = user.totalRewards.plus(reward)
  user.save()

  // 寻找对应的Stake记录
  let stakeId = event.params.stakeId.toString()
  // 我们需要检查所有该用户的Stake记录
  let stakes = Stake.load(event.params.stakeId.toString())
  
  if (stakes) {
    stakes.unstakeTransactionHash = event.transaction.hash
    stakes.unstakeAmount = event.params.hskAmount
    stakes.isWithdrawn = true
    stakes.isEarlyWithdrawal = event.params.isEarlyWithdrawal
    stakes.penalty = event.params.penalty
    stakes.unstakeAt = event.block.timestamp
    stakes.profit = event.params.hskAmount.minus(stakes.hskAmount)
    stakes.save()
  } else {
    log.warning("找不到对应的Stake记录，无法更新解质押信息: txHash={}, stakeId={}", [
      event.transaction.hash.toHexString(),
      stakeId
    ])
    
    // 创建一个新的记录，记录解质押信息
    let unstakeRecord = new Stake(
      event.transaction.hash.toHexString() + '-unstake-' + event.logIndex.toString()
    )
    unstakeRecord.user = user.id
    unstakeRecord.stakeId = event.params.stakeId
    unstakeRecord.hskAmount = BigInt.zero() // 原始质押金额未知
    unstakeRecord.sharesAmount = event.params.sharesAmount
    unstakeRecord.stakeType = 0 // 假设类型
    unstakeRecord.lockEndTime = event.block.timestamp // 假设锁定期已结束
    unstakeRecord.blockNumber = event.block.number
    unstakeRecord.blockTimestamp = event.block.timestamp
    unstakeRecord.transactionHash = event.transaction.hash
    unstakeRecord.stakedAt = BigInt.zero() // 原始质押时间未知
    unstakeRecord.isWithdrawn = true
    unstakeRecord.unstakeTransactionHash = event.transaction.hash
    unstakeRecord.unstakeAmount = event.params.hskAmount
    unstakeRecord.isEarlyWithdrawal = event.params.isEarlyWithdrawal
    unstakeRecord.penalty = event.params.penalty
    unstakeRecord.unstakeAt = event.block.timestamp
    
    // Determine if this was a locked unstake based on the same criteria as stake
    // This is a guess since we don't have the original stake
    unstakeRecord.isLocked = event.params.isEarlyWithdrawal // Assuming early withdrawals are from locked stakes
    
    unstakeRecord.save()
  }
}

export function handleTokenTransfer(event: TransferEvent): void {
  let transfer = new TokenTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  transfer.token = event.address
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.amount = event.params.value
  transfer.transactionHash = event.transaction.hash
  transfer.blockNumber = event.block.number
  transfer.blockTimestamp = event.block.timestamp
  transfer.save()
}