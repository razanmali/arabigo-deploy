// import { clerkMiddleware } from '@clerk/nextjs/server';


// export default clerkMiddleware({
//   publicRoutes: ["/", "/api/webhooks/stripe"],
// });


// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };




// middleware.ts  (put at project root, or in /src if you use it)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (no auth)
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks/stripe",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect everything that's not public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Next.js middleware matcher (recommended pattern from docs)
export const config = {
  matcher: [
    // Skip Next.js internals and static files (unless in search params)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API & tRPC routes
    "/(api|trpc)(.*)",
  ],
};
