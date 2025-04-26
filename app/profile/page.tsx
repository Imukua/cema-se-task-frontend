"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  CalendarDays,
  Mail,
  Shield,
  Key,
  LockKeyhole,
  UserCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Import API service
import { userApi } from "@/lib/api/userApi";
// Import User type
import { User as UserType } from "@/lib/types/api";
// Import useAuth hook
import { useAuth } from "@/lib/auth/AuthContext";

// Helper function to format dates
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return "N/A"; // Handle invalid dates
  }
};

export default function ProfilePage() {
  const { user: loggedInUser, isLoading: isAuthLoading } = useAuth(); // Get logged-in user details and auth loading state

  const [user, setUser] = useState<UserType | null>(null); // State for the current user's profile data
  const [loadingUserData, setLoadingUserData] = useState(true); // Loading state for fetching user data

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!loggedInUser) {
        // If not logged in, set loading to false and user to null
        setLoadingUserData(false);
        setUser(null);
        return;
      }

      setLoadingUserData(true);
      try {
        // Use the logged-in user's ID to fetch their full profile details from the API
        const userResponse: UserType = await userApi.getUser(loggedInUser.id);
        setUser(userResponse);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // Set user to null if fetching fails
      } finally {
        setLoadingUserData(false);
      }
    };

    // Fetch user profile when auth loading is complete and loggedInUser is available
    if (!isAuthLoading) {
      fetchUserProfile();
    }
  }, [loggedInUser, isAuthLoading]); // Re-run effect when loggedInUser or isAuthLoading changes

  // Generate initials from user name
  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Show loading skeleton if authentication or user data is loading
  if (isAuthLoading || loadingUserData) {
    return (
      <div className="min-h-[80vh] p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl">
        <div className="flex justify-end mb-6">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-28 w-28 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <div className="flex space-x-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-40 rounded-full" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-7 w-56" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-7 w-40" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-7 w-48" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-7 w-36" />
                </div>
              </div>
            </div>
            <div className="pt-6 space-y-4">
              <Skeleton className="h-7 w-48" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-40 rounded-md" />
                <Skeleton className="h-10 w-64 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If auth is not loading and user is null, it means not authenticated
  if (!isAuthLoading && !loggedInUser) {
    // This case should ideally be handled by a routing guard or AuthProvider redirect
    // but displaying a message is a fallback.
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <LockKeyhole className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">
            You must be logged in to view this page.
          </p>
          {/* Link to login page - adjust href as needed */}
          <Link href="/login">
            <Button className="bg-teal-600 hover:bg-teal-700 w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If auth loading is done, loggedInUser exists, but fetching user data failed
  if (!loadingUserData && !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <UserCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
          <p className="text-gray-600">
            Unable to load your user profile details.
          </p>
          <Link href="/dashboard">
            <Button className="bg-teal-600 hover:bg-teal-700 w-full">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If loading is done and user data is available, render the profile
  // Added explicit check !loadingUserData && user for clarity although the prior checks handle other states
  if (!loadingUserData && user) {
    // Generate initials from user name
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    };

    return (
      <div className="min-h-[80vh] p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl">
        <div className="flex justify-end mb-6">
          {/* Link to edit page using the fetched user's ID */}
          <Link href={`/users/${user.id}/edit`}>
            <Button className="bg-teal-600 hover:bg-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-4 relative">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg bg-gradient-to-br from-teal-400 to-teal-600 text-white text-3xl">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold text-teal-800">
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center mt-3 gap-2">
                  <Badge
                    className={`px-3 py-1 text-sm font-medium ${
                      user.role === "ADMIN"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-teal-100 text-teal-700 border border-teal-200"
                    }`}
                  >
                    {user.role}
                  </Badge>
                  <div className="flex items-center text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>Member since {formatDate(user.createdAt)}</span>{" "}
                    {/* Use helper */}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-6">
                <div className="p-5 bg-teal-50 rounded-xl transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-teal-600" />
                    <h3 className="text-sm font-medium text-gray-500">
                      Email Address
                    </h3>
                  </div>
                  <p className="text-lg font-medium text-teal-700 pl-8">
                    {user.email}
                  </p>
                </div>
                <div className="p-5 bg-blue-50 rounded-xl transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  </div>
                  <p className="text-lg font-medium text-blue-700 pl-8">
                    {user.role}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-5 bg-purple-50 rounded-xl transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <h3 className="text-sm font-medium text-gray-500">
                      Last Login
                    </h3>
                  </div>
                  {/* This would require an API call to fetch last login time */}
                  <p className="text-lg font-medium text-purple-700 pl-8">
                    Data Not Available
                  </p>{" "}
                  {/* Placeholder */}
                </div>
                <div className="p-5 bg-green-50 rounded-xl transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="text-sm font-medium text-gray-500">
                      Account Status
                    </h3>
                  </div>
                  <div className="flex items-center pl-8">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    <p className="text-lg font-medium text-green-700">Active</p>{" "}
                    {/* Assuming always active */}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-teal-100">
              <div className="flex items-center gap-2 mb-6">
                <LockKeyhole className="h-5 w-5 text-teal-700" />
                <h3 className="text-xl font-medium text-teal-700">
                  Account Security
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Link to change password page - adjust href as needed */}
                <Link href={`users/${user.id}/edit`}>
                  {" "}
                  {/* Assuming a dedicated change password page for the logged-in user */}
                  <Button
                    variant="outline"
                    className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-all flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Change Password
                  </Button>
                </Link>
                {/* Enable Two-Factor Authentication button - functionality not implemented */}
                <Button
                  variant="outline"
                  className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-all flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback return if none of the above conditions are met (should not happen with proper state management)
  return null;
}
