module.exports = {
  // ... 其他配置
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '.*', // 忽略所有参数
      varsIgnorePattern: '.*'  // 忽略所有变量
    }]
  }
} 