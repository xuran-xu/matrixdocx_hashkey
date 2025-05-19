import { createPublicClient, http } from 'viem';
import { hashkey } from 'viem/chains';
import { ERC20ABI } from '@/constants/abi';

const publicClient = createPublicClient({
  chain: hashkey,
  transport: http(process.env.RPC_URL!), // .env 里的 RPC_URL
});

/**
 * 获取当前区块号
 */
export async function getCurrentBlockNumber(): Promise<bigint> {
  return await publicClient.getBlockNumber();
}

/**
 * 获取指定地址在指定区块的 XAUM 余额
 */
export async function getUserXaumBalance(
  address: `0x${string}`,
  blockNumber?: bigint
): Promise<bigint> {
  // XAUM_TOKEN_ADDRESS 建议直接用 .env 或常量
  const XAUM_TOKEN_ADDRESS = process.env.XAUM_TOKEN_ADDRESS as `0x${string}`;
  if (!XAUM_TOKEN_ADDRESS) return BigInt(0);

  try {
    const balance = await publicClient.readContract({
      address: XAUM_TOKEN_ADDRESS,
      abi: ERC20ABI,
      functionName: 'balanceOf',
      args: [address],
      ...(blockNumber ? { blockNumber } : {}),
    });
    return BigInt(balance as bigint);
  } catch (err) {
    console.error(`获取 XAUM 余额失败:`, err);
    return BigInt(0);
  }
}

/**
 * 根据区块号获取区块时间（秒级时间戳）
 */
export async function getBlockTimestamp(blockNumber: bigint): Promise<number | null> {
  try {
    const block = await publicClient.getBlock({ blockNumber });
    // block.timestamp 可能是 bigint，需转为 number
    return typeof block.timestamp === 'bigint' ? Number(block.timestamp) : block.timestamp;
  } catch (err) {
    console.error(`获取区块时间失败:`, err);
    return null;
  }
}

/**
 * 根据目标时间戳，查找最接近的区块号（向后查找）
 * 注意：区块链没有直接的“时间转区块号”API，这里用二分法查找
 */
export async function getBlockNumberByTimestamp(targetTimestamp: number): Promise<bigint | null> {
  try {
    let latest = await publicClient.getBlockNumber();
    let earliest = BigInt(1);

    while (earliest <= latest) {
      const mid = earliest + ((latest - earliest) >> BigInt(1));
      const block = await publicClient.getBlock({ blockNumber: mid });
      const ts = typeof block.timestamp === 'bigint' ? Number(block.timestamp) : block.timestamp;

      if (ts < targetTimestamp) {
        earliest = mid + BigInt(1);
      } else if (ts > targetTimestamp) {
        latest = mid - BigInt(1);
      } else {
        return mid;
      }
    }
    // 返回最接近且不小于目标时间戳的区块号
    return earliest;
  } catch (err) {
    console.error(`查找区块号失败:`, err);
    return null;
  }
}