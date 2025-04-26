"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { mockUsers } from "@/lib/mock-data"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call to get the current user
        setTimeout(() => {
          // Use the first user from mock data for demo purposes
          setUser(mockUsers[0])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
        <Card className="bg-white/80 border-teal-100">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">Unable to load user profile. Please try again later.</p>
        <Link href="/dashboard">
          <Button className="bg-teal-600 hover:bg-teal-700">Return to Dashboard</Button>
        </Link>
      </div>
    )
  }

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/profile/edit">
          <Button className="bg-teal-600 hover:bg-teal-700">Edit Profile</Button>
        </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24 bg-teal-100 text-teal-700 text-2xl">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-teal-700">{user.name}</h2>
              <div className="flex items-center mt-2 space-x-2">
                <Badge className={user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"}>
                  {user.role}
                </Badge>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="text-lg font-medium text-blue-700">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="text-lg font-medium text-blue-700">{user.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                <p className="text-lg font-medium text-blue-700">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-lg font-medium text-blue-700">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-teal-100">
            <h3 className="text-lg font-medium text-teal-700 mb-4">Account Security</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-blue-200 text-blue-600">
                Change Password
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-600">
                Enable Two-Factor Authentication
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
