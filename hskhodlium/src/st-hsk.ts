import {
  Approval as ApprovalEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
} from "../generated/StHSK/StHSK"
import {
  Approval,
  OwnershipTransferred as StHSKOwnershipTransferred,
  Transfer,
  TokenTransfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new StHSKOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  // 创建 Transfer 实体
  let transferEntity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  transferEntity.from = event.params.from
  transferEntity.to = event.params.to
  transferEntity.value = event.params.value

  transferEntity.blockNumber = event.block.number
  transferEntity.blockTimestamp = event.block.timestamp
  transferEntity.transactionHash = event.transaction.hash

  transferEntity.save()
  
  // 同时创建 TokenTransfer 实体用于统一的代币转账跟踪
  let tokenTransfer = new TokenTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  )
  tokenTransfer.token = event.address
  tokenTransfer.from = event.params.from
  tokenTransfer.to = event.params.to
  tokenTransfer.amount = event.params.value
  tokenTransfer.transactionHash = event.transaction.hash
  tokenTransfer.blockNumber = event.block.number
  tokenTransfer.blockTimestamp = event.block.timestamp
  tokenTransfer.save()
}