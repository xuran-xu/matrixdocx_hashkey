export const contractAddresses = {
    133: {
      stakingContract: '0xC027985cda8DD019d80c74E06EFE44158D1305ac' as `0x${string}`,
      stHSKToken: '0x0068418bAE51127Fc3e0331274De5CB9CaD337E7' as `0x${string}`,
    },
  };
  
  // 根据环境变量确定默认链ID
  export const defaultChainId = 133
  
  export const getContractAddresses = (chainId: number) => {
    return contractAddresses[chainId as keyof typeof contractAddresses] || 
      contractAddresses[defaultChainId];
  };