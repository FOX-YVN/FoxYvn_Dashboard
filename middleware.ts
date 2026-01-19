import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Пропустить публичные роуты
    if (path.startsWith('/api/auth/')) {
      return NextResponse.next();
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
