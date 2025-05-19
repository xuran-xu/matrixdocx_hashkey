import { userXaumBalanceSnapshots } from '@/drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export async function insertUserXaumBalanceSnapshot(
  db: NodePgDatabase,
  address: string,
  balance: bigint,
  snapshotDate: string,
  continuousHoldingDays: number // 新增参数
) {
  await db.insert(userXaumBalanceSnapshots).values({
    id: uuidv4(),
    userWalletAddress: address,
    balance: balance.toString(),
    snapshotDate,
    continuousHoldingDays, // 新增字段
    createdAt: new Date(),
  }).onConflictDoNothing();
}