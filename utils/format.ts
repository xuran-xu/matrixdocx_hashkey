import { ethers } from 'ethers';

// 格式化大整数为可读的字符串
export function formatBigInt(value: bigint | undefined, decimals = 18, displayDecimals = 4): string {
  if (value === undefined) return '0';
  
  const valueString = value.toString();
  const wholePart = valueString.length <= decimals 
    ? '0' 
    : valueString.slice(0, valueString.length - decimals);
  
  let fractionalPart = valueString.length <= decimals 
    ? valueString.padStart(decimals, '0') 
    : valueString.slice(valueString.length - decimals);
  
  // 如果需要截断小数位数
  if (displayDecimals < decimals) {
    fractionalPart = fractionalPart.slice(0, displayDecimals);
  }
  
  // 如果小数部分为0，则不显示
  return fractionalPart === '0' ? wholePart : `${wholePart}.${fractionalPart}`;
}

// 将字符串转换为以太单位的BigInt
export function parseEther(value: string): bigint {
  try {
    return ethers.parseUnits(value, 18);
  } catch (e) {
    return BigInt(0);
  }
}
