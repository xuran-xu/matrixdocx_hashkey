import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary/10 backdrop-blur-sm border-t border-primary/20 fixed bottom-0 w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-primary">
            <div>© {new Date().getFullYear()} HashKey Chain X</div>
          </div>
          <div className="flex gap-6">
            <Link
              href="https://x.com/HashKeyHSK"
              target="_blank"
              className="text-primary hover:text-accent flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>  
              Twitter
            </Link>
            <Link
              href="https://t.me/HashKeyChainHSK"
              target="_blank"
              className="text-primary hover:text-accent flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.8 16.8c.15-.17.24-.38.271-.607.03-.226-.006-.453-.102-.655L16.05 12l.92-3.538a1.202 1.202 0 00-.103-.655 1.152 1.152 0 00-.272-.608 1.088 1.088 0 00-.587-.357 1.08 1.08 0 00-.665.019c-.8.273-2.356.803-3.039 1.035l-5.851 2.002a1.08 1.08 0 00-.625.539 1.118 1.118 0 00-.136.813c.073.279.25.52.492.67.242.15.528.204.808.148l2.9-.561c.22 1.538 1.427 4.693 1.546 5.057a.509.509 0 00.243.319.498.498 0 00.4.075c.052-.012.101-.034.144-.065l2.016-1.73.764.54 2.7 1.913a1.05 1.05 0 00.515.252c.19.035.384.035.574 0a1.16 1.16 0 00.517-.252z" />
              </svg>
              Telegram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}