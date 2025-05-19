import { scannerState } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export async function getLastScannerState(
  db: NodePgDatabase,
  SCANNER_ID: string
) {
  const result = await db.select().from(scannerState).where(eq(scannerState.id, SCANNER_ID));
  return result[0];
}

export async function updateScannerState(
  db: NodePgDatabase,
  SCANNER_ID: string,
  block: bigint,
  CONFIRMATION_DELAY: number
) {
  const now = new Date();
  await db
    .insert(scannerState)
    .values({
      id: SCANNER_ID,
      currentProcessingBlock: block,
      lastSuccessfullyProcessedBlock: block,
      confirmedBlockCursor: block - BigInt(CONFIRMATION_DELAY),
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: scannerState.id,
      set: {
        currentProcessingBlock: block,
        lastSuccessfullyProcessedBlock: block,
        confirmedBlockCursor: block - BigInt(CONFIRMATION_DELAY),
        updatedAt: now,
      },
    });
}