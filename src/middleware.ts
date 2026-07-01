import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isLoginRoute = nextUrl.pathname === '/login';
  const isAdminRoute = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/api/admin');
  const isPublicApiRoute = nextUrl.pathname.startsWith('/api') && !isAuthRoute && !isAdminRoute;

  // Let NextAuth handle its own API routes
  if (isAuthRoute) return;

  // Let the existing Admin system work independently
  if (isAdminRoute) return;

  // Allow public API routes (or protect them if needed later)
  // For now, allow API so webhook and seed works
  if (isPublicApiRoute) return;

  // Redirect to /login if not logged in and not on the login page
  if (!isLoggedIn && !isLoginRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // Redirect away from login page if already logged in
  if (isLoggedIn && isLoginRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
