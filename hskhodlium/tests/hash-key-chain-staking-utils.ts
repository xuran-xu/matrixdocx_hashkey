import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/HashKeyChainStaking/HashKeyChainStaking"

export function createAnnualBudgetUpdatedEvent(
  oldValue: BigInt,
  newValue: BigInt
): AnnualBudgetUpdated {
  let annualBudgetUpdatedEvent = changetype<AnnualBudgetUpdated>(newMockEvent())

  annualBudgetUpdatedEvent.parameters = new Array()

  annualBudgetUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldValue",
      ethereum.Value.fromUnsignedBigInt(oldValue)
    )
  )
  annualBudgetUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newValue",
      ethereum.Value.fromUnsignedBigInt(newValue)
    )
  )

  return annualBudgetUpdatedEvent
}

export function createEarlyWithdrawalPenaltyUpdatedEvent(
  stakeType: i32,
  oldValue: BigInt,
  newValue: BigInt
): EarlyWithdrawalPenaltyUpdated {
  let earlyWithdrawalPenaltyUpdatedEvent =
    changetype<EarlyWithdrawalPenaltyUpdated>(newMockEvent())

  earlyWithdrawalPenaltyUpdatedEvent.parameters = new Array()

  earlyWithdrawalPenaltyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "stakeType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(stakeType))
    )
  )
  earlyWithdrawalPenaltyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldValue",
      ethereum.Value.fromUnsignedBigInt(oldValue)
    )
  )
  earlyWithdrawalPenaltyUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newValue",
      ethereum.Value.fromUnsignedBigInt(newValue)
    )
  )

  return earlyWithdrawalPenaltyUpdatedEvent
}

export function createEmergencyWithdrawEvent(
  user: Address,
  sharesAmount: BigInt,
  hskAmount: BigInt
): EmergencyWithdraw {
  let emergencyWithdrawEvent = changetype<EmergencyWithdraw>(newMockEvent())

  emergencyWithdrawEvent.parameters = new Array()

  emergencyWithdrawEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  emergencyWithdrawEvent.parameters.push(
    new ethereum.EventParam(
      "sharesAmount",
      ethereum.Value.fromUnsignedBigInt(sharesAmount)
    )
  )
  emergencyWithdrawEvent.parameters.push(
    new ethereum.EventParam(
      "hskAmount",
      ethereum.Value.fromUnsignedBigInt(hskAmount)
    )
  )

  return emergencyWithdrawEvent
}

export function createExchangeRateUpdatedEvent(
  totalPooledHSK: BigInt,
  totalShares: BigInt,
  newRate: BigInt
): ExchangeRateUpdated {
  let exchangeRateUpdatedEvent = changetype<ExchangeRateUpdated>(newMockEvent())

  exchangeRateUpdatedEvent.parameters = new Array()

  exchangeRateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalPooledHSK",
      ethereum.Value.fromUnsignedBigInt(totalPooledHSK)
    )
  )
  exchangeRateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalShares",
      ethereum.Value.fromUnsignedBigInt(totalShares)
    )
  )
  exchangeRateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newRate",
      ethereum.Value.fromUnsignedBigInt(newRate)
    )
  )

  return exchangeRateUpdatedEvent
}

export function createHskPerBlockUpdatedEvent(
  oldValue: BigInt,
  newValue: BigInt
): HskPerBlockUpdated {
  let hskPerBlockUpdatedEvent = changetype<HskPerBlockUpdated>(newMockEvent())

  hskPerBlockUpdatedEvent.parameters = new Array()

  hskPerBlockUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldValue",
      ethereum.Value.fromUnsignedBigInt(oldValue)
    )
  )
  hskPerBlockUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newValue",
      ethereum.Value.fromUnsignedBigInt(newValue)
    )
  )

  return hskPerBlockUpdatedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createInsufficientRewardsEvent(
  required: BigInt,
  available: BigInt
): InsufficientRewards {
  let insufficientRewardsEvent = changetype<InsufficientRewards>(newMockEvent())

  insufficientRewardsEvent.parameters = new Array()

  insufficientRewardsEvent.parameters.push(
    new ethereum.EventParam(
      "required",
      ethereum.Value.fromUnsignedBigInt(required)
    )
  )
  insufficientRewardsEvent.parameters.push(
    new ethereum.EventParam(
      "available",
      ethereum.Value.fromUnsignedBigInt(available)
    )
  )

  return insufficientRewardsEvent
}

export function createMaxHskPerBlockUpdatedEvent(
  oldValue: BigInt,
  newValue: BigInt
): MaxHskPerBlockUpdated {
  let maxHskPerBlockUpdatedEvent =
    changetype<MaxHskPerBlockUpdated>(newMockEvent())

  maxHskPerBlockUpdatedEvent.parameters = new Array()

  maxHskPerBlockUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldValue",
      ethereum.Value.fromUnsignedBigInt(oldValue)
    )
  )
  maxHskPerBlockUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newValue",
      ethereum.Value.fromUnsignedBigInt(newValue)
    )
  )

  return maxHskPerBlockUpdatedEvent
}

export function createMinStakeAmountUpdatedEvent(
  oldValue: BigInt,
  newValue: BigInt
): MinStakeAmountUpdated {
  let minStakeAmountUpdatedEvent =
    changetype<MinStakeAmountUpdated>(newMockEvent())

  minStakeAmountUpdatedEvent.parameters = new Array()

  minStakeAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldValue",
      ethereum.Value.fromUnsignedBigInt(oldValue)
    )
  )
  minStakeAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newValue",
      ethereum.Value.fromUnsignedBigInt(newValue)
    )
  )

  return minStakeAmountUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRewardsAddedEvent(
  amount: BigInt,
  from: Address
): RewardsAdded {
  let rewardsAddedEvent = changetype<RewardsAdded>(newMockEvent())

  rewardsAddedEvent.parameters = new Array()

  rewardsAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  rewardsAddedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )

  return rewardsAddedEvent
}

export function createRewardsClaimedEvent(
  user: Address,
  amount: BigInt
): RewardsClaimed {
  let rewardsClaimedEvent = changetype<RewardsClaimed>(newMockEvent())

  rewardsClaimedEvent.parameters = new Array()

  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  rewardsClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return rewardsClaimedEvent
}

export function createStakeEvent(
  user: Address,
  hskAmount: BigInt,
  sharesAmount: BigInt,
  stakeType: i32,
  lockEndTime: BigInt,
  stakeId: BigInt
): Stake {
  let stakeEvent = changetype<Stake>(newMockEvent())

  stakeEvent.parameters = new Array()

  stakeEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  stakeEvent.parameters.push(
    new ethereum.EventParam(
      "hskAmount",
      ethereum.Value.fromUnsignedBigInt(hskAmount)
    )
  )
  stakeEvent.parameters.push(
    new ethereum.EventParam(
      "sharesAmount",
      ethereum.Value.fromUnsignedBigInt(sharesAmount)
    )
  )
  stakeEvent.parameters.push(
    new ethereum.EventParam(
      "stakeType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(stakeType))
    )
  )
  stakeEvent.parameters.push(
    new ethereum.EventParam(
      "lockEndTime",
      ethereum.Value.fromUnsignedBigInt(lockEndTime)
    )
  )
  stakeEvent.parameters.push(
    new ethereum.EventParam(
      "stakeId",
      ethereum.Value.fromUnsignedBigInt(stakeId)
    )
  )

  return stakeEvent
}

export function createStakingBonusUpdatedEvent(
  stakeType: i32,
  oldValue: BigInt,
  newValue: BigInt
): StakingBonusUpdated {
  let stakingBonusUpdatedEvent = changetype<StakingBonusUpdated>(newMockEvent())

  stakingBonusUpdatedEvent.parameters = new Array()

  stakingBonusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "stakeType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(stakeType))
    )
  )
  stakingBonusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldValue",
      ethereum.Value.fromUnsignedBigInt(oldValue)
    )
  )
  stakingBonusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newValue",
      ethereum.Value.fromUnsignedBigInt(newValue)
    )
  )

  return stakingBonusUpdatedEvent
}

export function createStakingContractUpgradedEvent(
  newVersion: BigInt
): StakingContractUpgraded {
  let stakingContractUpgradedEvent =
    changetype<StakingContractUpgraded>(newMockEvent())

  stakingContractUpgradedEvent.parameters = new Array()

  stakingContractUpgradedEvent.parameters.push(
    new ethereum.EventParam(
      "newVersion",
      ethereum.Value.fromUnsignedBigInt(newVersion)
    )
  )

  return stakingContractUpgradedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUnstakeEvent(
  user: Address,
  sharesAmount: BigInt,
  hskAmount: BigInt,
  isEarlyWithdrawal: boolean,
  penalty: BigInt,
  stakeId: BigInt
): Unstake {
  let unstakeEvent = changetype<Unstake>(newMockEvent())

  unstakeEvent.parameters = new Array()

  unstakeEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  unstakeEvent.parameters.push(
    new ethereum.EventParam(
      "sharesAmount",
      ethereum.Value.fromUnsignedBigInt(sharesAmount)
    )
  )
  unstakeEvent.parameters.push(
    new ethereum.EventParam(
      "hskAmount",
      ethereum.Value.fromUnsignedBigInt(hskAmount)
    )
  )
  unstakeEvent.parameters.push(
    new ethereum.EventParam(
      "isEarlyWithdrawal",
      ethereum.Value.fromBoolean(isEarlyWithdrawal)
    )
  )
  unstakeEvent.parameters.push(
    new ethereum.EventParam(
      "penalty",
      ethereum.Value.fromUnsignedBigInt(penalty)
    )
  )
  unstakeEvent.parameters.push(
    new ethereum.EventParam(
      "stakeId",
      ethereum.Value.fromUnsignedBigInt(stakeId)
    )
  )

  return unstakeEvent
}
