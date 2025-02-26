import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-neutral text-neutral-content">
      <div>
        <p className="font-bold">
          HashKey Chain <br />安全高效的质押平台
        </p>
        <p>© 2025 HashKey Chain. All rights reserved.</p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <Link href="#" className="link link-hover">关于我们</Link>
          <Link href="#" className="link link-hover">帮助中心</Link>
          <Link href="#" className="link link-hover">条款</Link>
          <Link href="#" className="link link-hover">隐私政策</Link>
        </div>
      </div>
    </footer>
  );
}