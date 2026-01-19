import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Пропустить публичные роуты
    if (path.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    if (path.startsWith('/api/')) {
      const forwarded = req.headers.get('x-forwarded-for') || '';
      const ip = forwarded.split(',')[0]?.trim() || req.ip || 'unknown';
      const { success } = rateLimit(ip, 100, 60000);
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': '60' } },
        );
      }
    }

    // Защита API
    if (path.startsWith('/api/') && !token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Защита страниц приложения
    if ((path.startsWith('/modules/') || path.startsWith('/dashboard')) && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Публичные страницы
        if (path === '/login' || path === '/signup' || path === '/') {
          return true;
        }
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ['/api/:path*', '/modules/:path*', '/dashboard/:path*'],
};
