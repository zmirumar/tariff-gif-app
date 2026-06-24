import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/login' || pathname === '/login/admin';
  const isAuthCallback = pathname.startsWith('/api/auth/callback');
  const isApiRoute = pathname.startsWith('/api/');
  const isPublicRoute = isLoginPage || isAuthCallback || isApiRoute;

  const isUserLoggedIn = !!user;
  const isUserAnAdmin = isUserLoggedIn && process.env.EMAIL?.split(',').map((e) => e.trim()).includes(user.email ?? '');

  if (pathname.startsWith('/admin')) {
    if (!isUserLoggedIn) {
      return NextResponse.redirect(new URL('/login/admin', request.url));
    }
    if (!isUserAnAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (!pathname.startsWith('/admin') && !isPublicRoute) {
    if (!isUserLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (isUserAnAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (isLoginPage) {
    if (isUserLoggedIn) {
      return NextResponse.redirect(
        new URL(isUserAnAdmin ? '/admin' : '/', request.url)
      );
    }
  }

  return supabaseResponse;
}
