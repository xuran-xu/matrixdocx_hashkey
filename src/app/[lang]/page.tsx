import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function HomePage({
  params
}: {
  params: { lang: string }
}) {
  const { lang } = params;

  return (
    <MainLayout lang={lang}>
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Matrixdocx 生态系统</h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            探索、连接并参与我们蓬勃发展的区块链生态系统
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${lang}/projects`} className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-lg">
              探索项目
            </Link>
            <Link href={`/${lang}/events`} className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-6 rounded-lg shadow-lg">
              查看活动
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">特色项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 这里将来放置项目卡片 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">示例项目 1</h3>
              <p className="text-gray-600 mb-4">这是一个示例项目描述...</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">了解更多</button>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">示例项目 2</h3>
              <p className="text-gray-600 mb-4">这是一个示例项目描述...</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">了解更多</button>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">示例项目 3</h3>
              <p className="text-gray-600 mb-4">这是一个示例项目描述...</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">了解更多</button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
