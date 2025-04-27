"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { PageSkeleton } from "./loading-skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;

    // Define paths that are always accessible
    const publicPaths = ["/login", "/register", "/api-docs"];
    const isPublicPath = publicPaths.some((path) => pathname?.includes(path));

    // If not authenticated and not on a public page, redirect to login
    if (!isAuthenticated && !isPublicPath) {
      router.push("/login");
    }

    // If authenticated and on login or register page, redirect to dashboard
    // We still want to allow authenticated users to see api-docs, so we exclude it here.
    if (
      isAuthenticated &&
      (pathname?.includes("/login") || pathname?.includes("/register"))
    ) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show nothing while checking authentication
  if (isLoading) {
    return <PageSkeleton />;
  }

  // For public pages, or if authenticated
  // The redirection logic in useEffect handles the protected routes
  return <>{children}</>;
}
