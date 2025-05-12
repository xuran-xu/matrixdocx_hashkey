import Link from 'next/link';

export default function Footer({ lang = 'zh' }: { lang?: string }) {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Matrixdocx</h3>
            <p className="text-gray-400">
              基于区块链技术的社区平台
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lang}/projects`} className="text-gray-400 hover:text-white">
                  项目
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/events`} className="text-gray-400 hover:text-white">
                  活动
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/about`} className="text-gray-400 hover:text-white">
                  关于
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Twitter
                </a>
              </li>
              <li className="text-gray-400">
                <a href="https://discord.gg/yourdiscord" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Discord
                </a>
              </li>
              <li className="text-gray-400">
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Matrixdocx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
