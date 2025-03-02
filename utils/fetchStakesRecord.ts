export async function fetchUnstakingHistory(
    userAddress: string,
    stakingContractAddress: string
  ) {
    try {
      // 根据环境确定基础URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_ENABLED === 'true' 
        ? 'https://hashkeychain-testnet-explorer.alt.technology/api/v2  ' 
        : 'https://hashkey.blockscout.com/api/v2';
      
      console.log("调用 fetchUnstakingHistory 函数", { userAddress, stakingContractAddress, baseUrl });
      
      // 1. 获取用户的所有交易
      const txResponse = await fetch(
        `${baseUrl}?module=account&action=txlist&address=${userAddress}`
      );
      
      if (!txResponse.ok) {
        console.error(`API 请求失败: ${txResponse.status} ${txResponse.statusText}`);
        throw new Error(`Failed to fetch transactions: ${txResponse.statusText}`);
      }
      
      const txData = await txResponse.json();
      console.log("交易列表API响应:", txData);
      
      // 确保我们有数据并筛选与质押合约相关的交易
      if (!txData.result || !Array.isArray(txData.result)) {
        console.error("API 没有返回预期格式的数据:", txData);
        return [];
      }
      
      // 筛选与合约相关的 unstakeLocked 交易
      const unstakeTransactions = txData.result.filter((tx: any) => {
        // 检查交易是否指向质押合约
        const isToStakingContract = tx.to && tx.to.toLowerCase() === stakingContractAddress.toLowerCase();
        
        // 检查交易输入是否匹配 unstakeLocked 函数签名
        const isUnstakeMethod = tx.input && tx.input.startsWith('0xaec6b737');
        
        return isToStakingContract && isUnstakeMethod;
      });
      
      console.log(`找到 ${unstakeTransactions.length} 笔解除质押交易`, unstakeTransactions);
      
      // 2. 获取每笔交易的详细信息
      const unstakeHistory = await Promise.all(
        unstakeTransactions.map(async (tx: any) => {
          try {
            const txHash = tx.hash;
            console.log(`获取交易 ${txHash} 的详细信息`);
            
            // 获取交易详情 - 注意不同浏览器API路径可能不同
            const txDetailResponse = await fetch(
              `${baseUrl}/v2/transactions/${txHash}`
            );
            
            if (!txDetailResponse.ok) {
              console.error(`获取交易详情失败: ${txDetailResponse.status}`);
              return null;
            }
            
            const txDetail = await txDetailResponse.json();
            console.log(`交易 ${txHash} 详情:`, txDetail);
            
            // 解析 stakeId 参数
            let stakeId = 0;
            if (tx.input && tx.input.length >= 74) { // 0xaec6b737 + 64位参数
              const stakeIdHex = '0x' + tx.input.slice(10);
              stakeId = parseInt(stakeIdHex, 16);
              console.log(`解析到 stakeId: ${stakeId}`);
            }
            
            // 由于我们可能无法直接获取状态变更数据
            // 可以通过交易收据的事件日志推断 
            // 这里简化处理，返回交易基本信息
            return {
              txHash,
              timestamp: tx.timeStamp || Math.floor(Date.now() / 1000),
              blockNumber: tx.blockNumber,
              stakeId,
              method: 'unstakeLocked',
              // 这些值在前端中可能需要从本地状态补充
              unstaked: BigInt(0),
              burnedShares: BigInt(0),
              originalAmount: BigInt(0),
              profit: BigInt(0)
            };
          } catch (error) {
            console.error(`处理交易时出错:`, error);
            return null;
          }
        })
      );
      
      // 过滤无效数据并排序
      const validHistory = unstakeHistory
        .filter(Boolean)
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      
      console.log(`返回 ${validHistory.length} 条有效历史记录`);
      return validHistory;
        
    } catch (error) {
      console.error('获取解除质押历史出错:', error);
      throw error;
    }
  }