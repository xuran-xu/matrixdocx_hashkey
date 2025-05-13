export const formatBigInt = (value: bigint, decimals: number = 18): string => {
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  
  return `${integerPart}.${fractionalPart.toString().padStart(decimals, '0')}`;
}
