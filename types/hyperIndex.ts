export interface LpDailySnapshotRequestBody {
  pairAddress: string;
  walletAddress: string;
}

export interface LpDailySnapshotItem {
  id: number;
  date: string; // "2025-05-14"
  protocolType: string; // "v2"
  poolAddress: string; // "0xF8365695ccC4FCa53241d7d42BbDc3b2e7d43AE4"
  userAddress: string; // "0xd00bEb829226d79931E03B24D00A40D5e7F51BdE"
  nftTokenId: string | null;
  lpAmount: string; // "64003319"
  valueUsd: string; // "0.000180780658214982"
  tickLower: number | null;
  tickUpper: number | null;
  createdAt: string; // "2025-05-14T21:35:29.252Z"
}