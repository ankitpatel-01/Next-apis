import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value || '';

    const publicRoutes = ['/login', '/signup'];

    if (!userId && !publicRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const restrictedWhenLoggedIn = ['/login', '/signup'];

    const { pathname } = request.nextUrl;

    if (userId && restrictedWhenLoggedIn.includes(pathname)) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/home', '/notes/:path*', '/login', '/signup'], // List of routes where the middleware should apply
};
