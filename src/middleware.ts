import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/question/:id",
    "tags",
    "tags/:id",
    "profile/:id",
    "community",
    "jobs",
    "/api/webhooks(.*)",
  ],
  ignoredRoutes: ["/api(.*)"],
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
