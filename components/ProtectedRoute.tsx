"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import { PageSkeleton } from "./loading-skeleton"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return

    // If not authenticated and not on login or register page, redirect to login
    if (!isAuthenticated && !pathname?.includes("/login") && !pathname?.includes("/register")) {
      router.push("/login")
    }

    // If authenticated and on login or register page, redirect to dashboard
    if (isAuthenticated && (pathname?.includes("/login") || pathname?.includes("/register"))) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Show nothing while checking authentication
  if (isLoading) {
    return <PageSkeleton />  }

  // For login and register pages, or if authenticated
  return <>{children}</>
}
