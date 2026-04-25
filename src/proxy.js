import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'vitacare-local-secret-39fn3f9jn3fn');

export async function proxy(request) {
  const token = request.cookies.get('vitacare_session')?.value;
  const path = request.nextUrl.pathname;
  
  if (!token) {
    if (path === '/' || path.startsWith('/profile') || path.startsWith('/api/profile')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, SECRET);
    if (path === '/login') return NextResponse.redirect(new URL('/', request.url));
  } catch (err) {
    request.cookies.delete('vitacare_session');
    if (path !== '/login') return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/profile', '/api/profile'],
};
