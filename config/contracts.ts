export const contractAddresses = {
    133: {
      stakingOldContract: '0x8F29450fa31e04991E1e104C517B01eFc5c303cf' as `0x${string}`,
      stakingContract: '0x4818006113B89bc57aB5a81767E0977b0E30a8D6' as `0x${string}`,
      stHSKToken: '0x' as `0x${string}`,
    },
    177: {
      stakingOldContract: '0x56E45F362cf4Bbfb5a99e631eF177f2907146483' as `0x${string}`,
      stakingContract: '' as `0x${string}`,
      stHSKToken: '0x' as `0x${string}`,
    },
  };
  
  // 根据环境变量确定默认链ID
  export const defaultChainId = 133
  
  export const getContractAddresses = (chainId: number) => {
    return contractAddresses[chainId as keyof typeof contractAddresses] || 
      contractAddresses[defaultChainId];
  };