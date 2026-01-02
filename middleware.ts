import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Run next-intl middleware first to handle routing/locale
    const response = intlMiddleware(request);

    // 2. Setup Supabase client on top of that response
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 3. Check auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 4. Protect admin routes
    const path = request.nextUrl.pathname;
    const isLoginPage = path.includes('/admin/login');
    const isAdminSection = path.includes('/admin');

    // Only protect if we are in admin section
    if (isAdminSection) {
        if (isLoginPage) {
            if (user) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
        } else {
            // Protected admin page
            if (!user) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/',
        '/(es|en|fr)/:path*',
        '/((?!_next|_vercel|.*\\..*).*)'
    ]
};
