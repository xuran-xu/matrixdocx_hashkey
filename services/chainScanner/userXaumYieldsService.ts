import { userXaumYields } from '@/drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export async function insertUserXaumYield(
  db: NodePgDatabase,
  address: string,
  snapshotDate: string,
  balance: bigint,
  isClaimed: boolean = false, // 新增参数
  claimedAt: Date | null = null // 新增参数
) {
  await db.insert(userXaumYields).values({
    id: uuidv4(),
    userWalletAddress: address,
    snapshotDate,
    balanceAtSnapshot: balance.toString(),
    yieldEarned: '0', // TODO: 计算收益
    apyRate: null,    // TODO: 计算APY
    isClaimed,        // 新增字段
    claimedAt,        // 新增字段
    createdAt: new Date(),
  }).onConflictDoNothing();
}