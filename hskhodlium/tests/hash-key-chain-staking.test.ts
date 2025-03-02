import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AnnualBudgetUpdated } from "../generated/schema"
import { AnnualBudgetUpdated as AnnualBudgetUpdatedEvent } from "../generated/HashKeyChainStaking/HashKeyChainStaking"
import { handleAnnualBudgetUpdated } from "../src/hash-key-chain-staking"
import { createAnnualBudgetUpdatedEvent } from "./hash-key-chain-staking-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let oldValue = BigInt.fromI32(234)
    let newValue = BigInt.fromI32(234)
    let newAnnualBudgetUpdatedEvent = createAnnualBudgetUpdatedEvent(
      oldValue,
      newValue
    )
    handleAnnualBudgetUpdated(newAnnualBudgetUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AnnualBudgetUpdated created and stored", () => {
    assert.entityCount("AnnualBudgetUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AnnualBudgetUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "oldValue",
      "234"
    )
    assert.fieldEquals(
      "AnnualBudgetUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newValue",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
