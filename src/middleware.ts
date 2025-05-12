import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'zh'];
const defaultLocale = 'zh';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已经有语言前缀
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return NextResponse.next();
  
  // 重定向到默认语言
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // 排除静态资源
    '/((?!api|_next/static|_next/image|favicon.ico|img|content).*)',
  ],
};
