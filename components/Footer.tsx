import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">HashKey Staking</h3>
            <p className="text-gray-400 mb-4">
              参与 HashKey Chain 生态质押，享受高收益回报。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">首页</Link>
              </li>
              <li>
                <Link href="/stake" className="text-gray-400 hover:text-white">质押</Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white">我的资产</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-white">免责声明</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">资源</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.hashkey.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  HashKey 官网
                </a>
              </li>
              <li>
                <a href="https://explorer.hsk.xyz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  区块链浏览器
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">文档</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HashKey Chain. 保留所有权利。
        </div>
      </div>
    </footer>
  );
}