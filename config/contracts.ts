export const contractAddresses = {
    133: {
      stakingContract: '0x179b407091108C16BE28aEF3509f45E7303e3FE4' as `0x${string}`,
      stHSKToken: '0x81f4B01E26707Edbaf2168Ed4E20C17f8d28fd8F' as `0x${string}`,
    },
  };
  
  // 根据环境变量确定默认链ID
  export const defaultChainId = 133
  
  export const getContractAddresses = (chainId: number) => {
    return contractAddresses[chainId as keyof typeof contractAddresses] || 
      contractAddresses[defaultChainId];
  };