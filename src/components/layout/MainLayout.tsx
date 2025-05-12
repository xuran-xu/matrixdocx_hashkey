import Header from './Header';
import Footer from './Footer';

export default function MainLayout({
  children,
  lang = 'zh'
}: {
  children: React.ReactNode;
  lang?: string;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
