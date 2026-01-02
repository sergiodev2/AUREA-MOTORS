import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If accessing admin routes and not authenticated
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // Exception for login page
        if (request.nextUrl.pathname === "/admin/login") {
            if (user) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return response;
        }

        if (!user) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Optional: Check connection to 'admins' table here or in layout.
        // For middleware speed, we might trust the generic 'user' check and let layout handle role check.
    }

    return response;
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
};
