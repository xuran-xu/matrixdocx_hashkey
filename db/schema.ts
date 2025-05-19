import {
  pgTable,
  text,
  decimal,
  timestamp,
  uniqueIndex,
  index,
  date,
  pgEnum,
  jsonb,
  primaryKey, // Import primaryKey
  bigint // Import bigint for blockNumber
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Optional: Define an enum for LP Record Types
export const lpRecordTypeEnum = pgEnum('lp_record_type', [
  'DEPOSIT',
  'WITHDRAWAL',
  'STAKE',
  'UNSTAKE',
  'REWARD_CLAIMED',
]);

// New table to manage scanner state
export const scannerState = pgTable('scanner_state', {
  id: text('id').primaryKey(), // A unique identifier for this state record (e.g., 'main_scanner')
  eventName: text('event_name').unique(), // Optional: if you want to track per event/contract
  
  // The latest block number that the scanner has attempted to fetch logs for.
  // This helps in understanding how far the scanner has "looked".
  currentProcessingBlock: bigint('current_processing_block', { mode: 'bigint' }),

  // The latest block number for which all events have been successfully processed and stored.
  // This is your "safe" cursor. The scanner should resume from this block + 1.
  lastSuccessfullyProcessedBlock: bigint('last_successfully_processed_block', { mode: 'bigint' }),

  // The block number that is considered "confirmed" after applying a delay.
  // (lastSuccessfullyProcessedBlock - confirmationDelay)
  // This can be useful for services that should only read confirmed data.
  confirmedBlockCursor: bigint('confirmed_block_cursor', { mode: 'bigint' }),
  
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});


// Optional: User table to centralize user information
export const users = pgTable('users', {
  walletAddress: text('wallet_address').primaryKey(), // Wallet address is the primary key
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

// 1. user 持有 xaum 余额表 (User XAUM Balance Table)
export const userXaumBalances = pgTable('user_xaum_balances', {
  id: text('id').primaryKey(), // Internal ID for this specific balance record
  userWalletAddress: text('user_wallet_address').notNull().references(() => users.walletAddress, { onDelete: 'cascade' }),
  balance: decimal('balance', { precision: 18, scale: 8 }).notNull().default('0'),
  lastUpdatedAt: timestamp('last_updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => {
  return {
    userWalletAddressIdx: uniqueIndex('user_xaum_balance_wallet_address_idx').on(table.userWalletAddress),
  };
});

// 2. user 持有 xaum 收益表 (User XAUM Yield Table)
export const userXaumYields = pgTable('user_xaum_yields', {
  id: text('id').primaryKey(), // Internal ID for this specific yield record
  userWalletAddress: text('user_wallet_address').notNull().references(() => users.walletAddress, { onDelete: 'cascade' }),
  snapshotDate: date('snapshot_date').notNull(),
  balanceAtSnapshot: decimal('balance_at_snapshot', { precision: 18, scale: 8 }).notNull(),
  yieldEarned: decimal('yield_earned', { precision: 18, scale: 8 }).notNull(),
  apyRate: decimal('apy_rate', { precision: 10, scale: 5 }), // Nullable
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userWalletAddressSnapshotDateIdx: uniqueIndex('user_xaum_yield_wallet_address_snapshot_date_idx').on(table.userWalletAddress, table.snapshotDate),
    userWalletAddressIdx: index('user_xaum_yield_wallet_address_idx').on(table.userWalletAddress),
    snapshotDateIdx: index('user_xaum_yield_snapshot_date_idx').on(table.snapshotDate),
  };
});

// 3. user 持有 HyperIndex LP 余额表 (User HyperIndex LP Balance Table)
export const userHyperIndexLpBalances = pgTable('user_hyperindex_lp_balances', {
  id: text('id').primaryKey(), // Internal ID for this specific LP balance record
  userWalletAddress: text('user_wallet_address').notNull().references(() => users.walletAddress, { onDelete: 'cascade' }),
  lpTokenSymbol: text('lp_token_symbol').notNull(), // e.g., "ETH-USDC-LP"
  balance: decimal('balance', { precision: 18, scale: 8 }).notNull().default('0'),
  lastUpdatedAt: timestamp('last_updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => {
  return {
    userWalletAddressLpSymbolIdx: uniqueIndex('user_hyperindex_lp_balance_wallet_address_lp_symbol_idx').on(table.userWalletAddress, table.lpTokenSymbol),
    userWalletAddressIdx: index('user_hyperindex_lp_balance_wallet_address_idx').on(table.userWalletAddress),
  };
});

// 4. user 持有 HyperIndex LP 收益表 (User HyperIndex LP Yield Table)
export const userHyperIndexLpYields = pgTable('user_hyperindex_lp_yields', {
  id: text('id').primaryKey(), // Internal ID for this specific LP yield record
  userWalletAddress: text('user_wallet_address').notNull().references(() => users.walletAddress, { onDelete: 'cascade' }),
  lpTokenSymbol: text('lp_token_symbol').notNull(),
  snapshotDate: date('snapshot_date').notNull(),
  balanceAtSnapshot: decimal('balance_at_snapshot', { precision: 18, scale: 8 }).notNull(),
  yieldEarned: decimal('yield_earned', { precision: 18, scale: 8 }).notNull(),
  apyRate: decimal('apy_rate', { precision: 10, scale: 5 }), // Nullable
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userWalletAddressLpSymbolSnapshotDateIdx: uniqueIndex('user_hyperindex_lp_yield_wallet_address_lp_snapshot_idx').on(table.userWalletAddress, table.lpTokenSymbol, table.snapshotDate),
    userWalletAddressIdx: index('user_hyperindex_lp_yield_wallet_address_idx').on(table.userWalletAddress),
    lpTokenSymbolIdx: index('user_hyperindex_lp_yield_lp_token_symbol_idx').on(table.lpTokenSymbol),
    snapshotDateIdx: index('user_hyperindex_lp_yield_snapshot_date_idx').on(table.snapshotDate),
  };
});

// 5. user HyperIndex LP 记录表 (User HyperIndex LP Record Table)
export const userHyperIndexLpRecords = pgTable('user_hyperindex_lp_records', {
  id: text('id').primaryKey(), // Internal ID for this specific LP record
  userWalletAddress: text('user_wallet_address').notNull().references(() => users.walletAddress, { onDelete: 'cascade' }),
  lpTokenSymbol: text('lp_token_symbol').notNull(),
  recordType: lpRecordTypeEnum('record_type').notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  transactionHash: text('transaction_hash'), // Nullable, TX hash of the LP event
  blockNumber: bigint('block_number', { mode: 'bigint' }), // Block number of the LP event
  details: jsonb('details'), // Nullable, for any additional type-specific data
  eventTimestamp: timestamp('event_timestamp', { withTimezone: true }).notNull(), // Timestamp of the on-chain LP event
}, (table) => {
  return {
    userWalletAddressIdx: index('user_hyperindex_lp_record_wallet_address_idx').on(table.userWalletAddress),
    lpTokenSymbolIdx: index('user_hyperindex_lp_record_lp_token_symbol_idx').on(table.lpTokenSymbol),
    recordTypeIdx: index('user_hyperindex_lp_record_record_type_idx').on(table.recordType),
  };
});
