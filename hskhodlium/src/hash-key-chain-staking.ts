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
  Unstake as UnstakeEvent
} from "../generated/HashKeyChainStaking/HashKeyChainStaking"
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
  Unpaused,
  Unstake
} from "../generated/schema"

export function handleAnnualBudgetUpdated(
  event: AnnualBudgetUpdatedEvent
): void {
  let entity = new AnnualBudgetUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
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

export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let entity = new EmergencyWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
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
  let entity = new Stake(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.hskAmount = event.params.hskAmount
  entity.sharesAmount = event.params.sharesAmount
  entity.stakeType = event.params.stakeType
  entity.lockEndTime = event.params.lockEndTime
  entity.stakeId = event.params.stakeId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
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
  let entity = new Unstake(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.sharesAmount = event.params.sharesAmount
  entity.hskAmount = event.params.hskAmount
  entity.isEarlyWithdrawal = event.params.isEarlyWithdrawal
  entity.penalty = event.params.penalty
  entity.stakeId = event.params.stakeId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
