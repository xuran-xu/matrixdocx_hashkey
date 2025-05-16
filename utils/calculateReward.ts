/**
 * 激励计算常量
 */
const ANNUAL_BASIC_RATE = 0.01; // 基础年化收益率: 1%
const ANNUAL_BEHAVIOR_RATE = 0.04; // 行为激励年化收益率: 4%
const DAYS_IN_YEAR = 365; // 一年的天数
const MIN_HOLDING_DAYS_FOR_BASIC_REWARD = 30; // 基础奖励的最低持仓天数
const MIN_HOLDING_AMOUNT_FOR_BASIC_REWARD = 30; // 基础奖励的最低持仓金额

/**
 * 计算每日解锁的基础年化奖励的参数
 */
interface DailyBasicRewardUnlockParams {
  /** 用户当前持仓金额 */
  holdingAmount: number;
  /** 用户当前连续持仓天数 (例如，今天是持仓的第30天，则为30) */
  currentHoldingDays: number;
}

/**
 * 计算每日解锁的基础年化奖励 (1%)
 * - 用户持有活动指定的资产（如 XAUM）
 * - 持仓时间需达到30天以上才能获得对应的奖励。
 * - 在达标的第30天，一次性解锁前30天的累积奖励。
 * - 之后每一天，解锁当天的奖励。
 *
 * @param params - 包含持仓金额和当前持仓天数的对象
 * @returns 当天解锁的基础奖励金额
 */
export function calculateDailyBasicRewardUnlock(
  { holdingAmount, currentHoldingDays }: DailyBasicRewardUnlockParams
): number {
  if (holdingAmount <= 0 || currentHoldingDays <= 0) {
    return 0;
  }
    
  if (holdingAmount < MIN_HOLDING_AMOUNT_FOR_BASIC_REWARD) {
    // 持仓金额不足x个XAUM，不解锁奖励
    return 0;
  }
  
  if (currentHoldingDays < MIN_HOLDING_DAYS_FOR_BASIC_REWARD) {
    // 持仓未满30天，不解锁奖励
    return 0;
  }

  const dailyRate = ANNUAL_BASIC_RATE / DAYS_IN_YEAR;

  if (currentHoldingDays === MIN_HOLDING_DAYS_FOR_BASIC_REWARD) {
    // 达到最低持仓天数（第30天），解锁前30天的全部奖励
    return holdingAmount * dailyRate * MIN_HOLDING_DAYS_FOR_BASIC_REWARD;
  }

  // 超过最低持仓天数后，每日解锁当天的奖励
  return holdingAmount * dailyRate; // 等同于 holdingAmount * ANNUAL_BASIC_RATE * 1 / DAYS_IN_YEAR
}

/**
 * 计算每日解锁的行为激励奖励的参数
 */
interface DailyBehavioralRewardUnlockParams {
  /** 用户参与行为的金额 (例如，DEX LP的金额或Lending的抵押资产金额) */
  amount: number;
}

/**
 * 计算每日解锁的DEX流动性行为奖励 (4%)
 * - 用户将资产注入 Dex 的 XAUM-USDT/USDC 或 XAUM-HSK 交易池，提供流动性。
 * - 奖励按 LP 持仓时间和金额分发。
 * - 假设此函数在用户提供LP的每一天被调用。
 *
 * @param params - 包含参与金额的对象
 * @returns 当天解锁的DEX LP奖励金额
 */
export function calculateDailyDexLPRewardUnlock(
  { amount }: DailyBehavioralRewardUnlockParams
): number {
  if (amount <= 0) {
    return 0;
  }
  return amount * ANNUAL_BEHAVIOR_RATE / DAYS_IN_YEAR;
}

/**
 * 计算每日解锁的Lending协议行为奖励 (4%)
 * - 用户将 XAUM 存入链上的 Lending 平台作为抵押资产。
 * - 奖励按抵押金额和时间分发。
 * - 假设此函数在用户提供抵押资产的每一天被调用。
 *
 * @param params - 包含参与金额的对象
 * @returns 当天解锁的Lending奖励金额
 */
export function calculateDailyLendingRewardUnlock(
  { amount }: DailyBehavioralRewardUnlockParams
): number {
  if (amount <= 0) {
    return 0;
  }
  const dailyRate = ANNUAL_BEHAVIOR_RATE / DAYS_IN_YEAR;
  return amount * dailyRate; // 等同于 amount * ANNUAL_BEHAVIOR_RATE * 1 / DAYS_IN_YEAR
}

/**
 * 关于“交易行为奖励”：
 * 根据描述，“用户在指定 Dex 上完成一定数量的交易，可获得小额奖励（例如DEX手续费返还等）”，
 * 并且这是“由项目方提供，和DeFi项目确认”。
 * 这种奖励通常是事件驱动的或基于外部条件的，而不是像上述那样固定的每日计息公式。
 * 其具体实现将取决于项目方定义的具体机制和规则。
 */

/**
 * 关于“DeFi项目额外激励（optional）”：
 * 这部分激励没有提供具体的计算规则，因此也无法在此实现为通用公式。
 * 如果有详细的规则，可以为其创建相应的计算函数。
 */

// --- 示例用法 ---
console.log("--- 基础年化奖励 (按天解锁) ---");
// 假设用户A持仓10000 XAUM
const userAHoldingAmount = 10000;
console.log(`用户A持仓 ${userAHoldingAmount} XAUM:`);

// 第1天到第29天
console.log(`  第29天解锁: ${calculateDailyBasicRewardUnlock({ holdingAmount: userAHoldingAmount, currentHoldingDays: 29 })}`); // 0

// 第30天 (达到最低持仓天数)
const day30Reward = calculateDailyBasicRewardUnlock({ holdingAmount: userAHoldingAmount, currentHoldingDays: 30 });
console.log(`  第30天解锁 (前30天总和): ${day30Reward}`); // 10000 * 0.01 * 30 / 365 ≈ 8.219

// 第31天
const day31Reward = calculateDailyBasicRewardUnlock({ holdingAmount: userAHoldingAmount, currentHoldingDays: 31 });
console.log(`  第31天解锁 (当天): ${day31Reward}`); // 10000 * 0.01 * 1 / 365 ≈ 0.273

// 第60天
const day60Reward = calculateDailyBasicRewardUnlock({ holdingAmount: userAHoldingAmount, currentHoldingDays: 60 });
console.log(`  第60天解锁 (当天): ${day60Reward}`); // 10000 * 0.01 * 1 / 365 ≈ 0.273

let totalBasicRewardAfter60Days = 0;
// 模拟计算60天总共解锁的基础奖励
// 实际应用中，你会每天记录或累加解锁的奖励
totalBasicRewardAfter60Days += calculateDailyBasicRewardUnlock({ holdingAmount: userAHoldingAmount, currentHoldingDays: 30 }); // 第30天解锁的
for (let day = 31; day <= 60; day++) {
  totalBasicRewardAfter60Days += calculateDailyBasicRewardUnlock({ holdingAmount: userAHoldingAmount, currentHoldingDays: day });
}
console.log(`  模拟到第60天，用户A累计解锁的基础奖励: ${totalBasicRewardAfter60Days.toFixed(4)}`);
// 理论总奖励: 10000 * 0.01 * 60 / 365 = 16.4383...
// 我们的按天解锁总和: (10000 * 0.01 * 30 / 365) + 30 * (10000 * 0.01 * 1 / 365) = 10000 * 0.01 * (30+30) / 365 = 10000 * 0.01 * 60 / 365. 一致。


console.log("\n--- 行为激励奖励 (DEX LP, 按天解锁) ---");
// 假设用户B在DEX提供了价值5000的LP
const userBLpAmount = 5000;
const dailyDexLpReward = calculateDailyDexLPRewardUnlock({ amount: userBLpAmount });
console.log(`用户B提供 ${userBLpAmount} LP，每日解锁DEX LP奖励: ${dailyDexLpReward.toFixed(4)}`); // 5000 * 0.04 * 1 / 365 ≈ 0.5479

console.log("\n--- 行为激励奖励 (Lending, 按天解锁) ---");
// 假设用户C在Lending平台抵押了价值8000的XAUM
const userCLendingAmount = 8000;
const dailyLendingReward = calculateDailyLendingRewardUnlock({ amount: userCLendingAmount });
console.log(`用户C抵押 ${userCLendingAmount} XAUM，每日解锁Lending奖励: ${dailyLendingReward.toFixed(4)}`); // 8000 * 0.04 * 1 / 365 ≈ 0.8767

/**
 * 注意：关于精度
 * JavaScript的Number类型是双精度浮点数，在进行金融计算时可能存在精度问题。
 * 对于处理真实货币或代币的生产系统，强烈建议使用专门的库，如 `decimal.js` 或 `bignumber.js`，
 * 来确保计算的精确性。以上实现未使用这些库，以便于理解核心逻辑。
 */
