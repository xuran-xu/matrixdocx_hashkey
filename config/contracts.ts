export const contractAddresses = {
    133: {
      XAUMToken: '0x2577217c86ae2E8a5f70Abb663B9231E5d47D15a' as `0x${string}`,
      USDTToken: '0xF1B50eD67A9e2CC94Ad3c477779E2d4cBfFf9029' as `0x${string}`,
      USDCToken: '0x054ed45810DbBAb8B27668922D110669c9D88D0a' as `0x${string}`,
      hyperPoolAddress: '0xF8365695ccC4FCa53241d7d42BbDc3b2e7d43AE4' as `0x${string}`,
    },
    177: {
      XAUMToken: '0x2577217c86ae2E8a5f70Abb663B9231E5d47D15a' as `0x${string}`,
      USDTToken: '0xF1B50eD67A9e2CC94Ad3c477779E2d4cBfFf9029' as `0x${string}`,
      USDCToken: '0x054ed45810DbBAb8B27668922D110669c9D88D0a' as `0x${string}`,
      hyperPoolAddress: '0xF8365695ccC4FCa53241d7d42BbDc3b2e7d43AE4' as `0x${string}`,
    },
  };
  
  // 根据环境变量确定默认链ID
  export const defaultChainId = 133
  
  export const getContractAddresses = (chainId: number) => {
    return contractAddresses[chainId as keyof typeof contractAddresses] || 
      contractAddresses[defaultChainId];
  };

  