import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
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
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
