export const contractAddresses = {
    133: {
      stakingContract: '0xDbFF0dCE82E9e9D0BAda19Ef578227c5FB978253' as `0x${string}`,
      stHSKToken: '0x81f4B01E26707Edbaf2168Ed4E20C17f8d28fd8F' as `0x${string}`,
    },
  };
  
  // 根据环境变量确定默认链ID
  export const defaultChainId = 133
  
  export const getContractAddresses = (chainId: number) => {
    return contractAddresses[chainId as keyof typeof contractAddresses] || 
      contractAddresses[defaultChainId];
  };