"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  User,
  Mail,
  Calendar,
  Shield,
  Clock,
  Users,
  ArrowLeft,
  Pencil,
  FileText,
  Settings,
  Key,
  BarChart3,
} from "lucide-react";

// Assuming these components exist and are relevant for the view page
import { ProgramStatsChart } from "@/components/program-stats-chart";
import { DoctorActivityTimeline } from "@/components/doctor-activity-timeline";

import { userApi } from "@/lib/api/userApi";
// Assuming a clientApi exists with a getClients method that accepts userId
import { clientApi } from "@/lib/api/clientApi";
import {
  User as UserType,
  Client as ClientType,
  PaginatedResponse,
} from "@/lib/types/api";

// Import useAuth hook
import { useAuth } from "@/lib/auth/AuthContext";

// Helper function to format dates
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return "N/A"; // Handle invalid dates
  }
};

export default function UserDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user: loggedInUser, isLoading: isAuthLoading } = useAuth(); // Get logged-in user details

  // Removed console.log({ loggedInUser, viewedUserId: id });

  const [viewedUser, setViewedUser] = useState<UserType | null>(null); // State for the user being viewed
  const [assignedClients, setAssignedClients] = useState<ClientType[]>([]);
  const [loadingData, setLoadingData] = useState(true); // Combined loading for user and clients
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      // Fetch the user whose page is being viewed
      const userResponse = await userApi.getUser(id);
      setViewedUser(userResponse);

      // Fetch clients assigned to this user
      const clientsResponse: PaginatedResponse<ClientType> =
        await clientApi.getClients(
          1, // page
          1000, // limit - assuming a large limit is sufficient
          undefined, // search
          id, // userId filter
        );
      setAssignedClients(clientsResponse.results);

      // Note: Enrollment stats, Active Programs count, and Success Rate are
      // not available from the provided user or client APIs.
      // The activity timeline is also not API-backed in the provided code.
    } catch (error) {
      console.error("Error fetching user data:", error);
      setViewedUser(null); // Set user to null if fetching fails (e.g., user not found)
      // Optionally clear assigned clients if fetching user failed
      setAssignedClients([]);
    } finally {
      setLoadingData(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  // Generate initials from user name
  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Note: activityTimeline is still using mock/placeholder data as no API is available
  // This should ideally be fetched from a backend API
  const activityTimeline = [
    {
      id: "1",
      type: "login",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      title: "Logged into the system",
    },
    {
      id: "2",
      type: "client",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      title: "Added new client: Sarah Miller",
      clientName: "Sarah Miller",
    },
    {
      id: "3",
      type: "enrollment",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      title: "Created enrollment for John Smith",
      clientName: "John Smith",
      programName: "Diabetes Management",
    },
    {
      id: "4",
      type: "update",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      title: "Updated client information for Michael Johnson",
      clientName: "Michael Johnson",
    },
    {
      id: "5",
      type: "login",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      title: "Logged into the system",
    },
  ];

  // Determine if the edit button and quick actions should be enabled
  const canEdit =
    loggedInUser && (loggedInUser.role === "ADMIN" || loggedInUser.id === id);

  if (loadingData || isAuthLoading) {
    // Show loading skeleton if user data or auth is loading
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card className="bg-white/80 border-none shadow-sm">
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
        {/* Skeleton for tabs content area */}
        <Skeleton className="h-64 w-full" />
        {/* Skeleton for sidebar area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-start-4 space-y-6">
            <Skeleton className="h-32 w-full" /> {/* Quick Actions Skeleton */}
            <Skeleton className="h-40 w-full" />{" "}
            {/* Account Security Skeleton */}
          </div>
        </div>
      </div>
    );
  }

  if (!viewedUser) {
    // Check if the viewed user data is null after loading
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">
          The user you are looking for does not exist or has been removed.
        </p>
        <Link href="/users">
          <Button className="bg-teal-600 hover:bg-teal-700">
            Return to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/users">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="page-title text-teal-700">User Profile</h1>
        </div>
        {/* Always render the Edit Profile button Link, but disable the Button and prevent pointer events if cannotEdit */}
        <Link
          href={`/users/${id}/edit`}
          style={{ pointerEvents: canEdit ? "auto" : "none" }}
        >
          <Button className="bg-teal-600 hover:bg-teal-700" disabled={!canEdit}>
            <Pencil className="h-4 w-4 mr-1" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Summary Card */}
        <Card className="bg-white/90 border-none shadow-sm lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-20 w-20 bg-blue-100 text-blue-700 text-xl">
                <AvatarFallback>{getInitials(viewedUser.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 font-playfair">
                      {viewedUser.name}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Mail className="h-4 w-4" />
                      <span>{viewedUser.email}</span>
                      <span className="text-gray-300">•</span>
                      <Badge
                        className={
                          viewedUser.role === "ADMIN"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-teal-100 text-teal-700"
                        }
                      >
                        {viewedUser.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Assigned Clients</p>
                      <p className="text-sm font-medium">
                        {assignedClients.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-teal-50 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium">
                        {formatDate(viewedUser.createdAt)}
                      </p>{" "}
                      {/* Use helper */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Status</p>
                      {/* Assuming account status is always active based on mock */}
                      <p className="text-sm font-medium">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {" "}
              {/* Adjust grid-cols if adding more tabs */}
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="clients"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                Assigned Clients ({assignedClients.length})
              </TabsTrigger>
              {/* Activity tab - requires API */}
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
              >
                Activity (Placeholder)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" /> Full
                          Name
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {viewedUser.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" /> Email
                          Address
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {viewedUser.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Shield className="h-4 w-4 mr-1 text-gray-400" /> Role
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {viewedUser.role}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          Created Date
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {formatDate(viewedUser.createdAt)} {/* Use helper */}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" /> Last
                          Updated
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {formatDate(viewedUser.updatedAt)} {/* Use helper */}
                        </p>
                      </div>
                      {/* Assigned Clients count repeated here for emphasis */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          Assigned Clients
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {assignedClients.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Overview Card - simplified as not all data is API backed */}
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                    Performance Overview (Limited Data)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-md text-center">
                      <p className="text-3xl font-bold text-blue-700">
                        {assignedClients.length}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Total Clients
                      </p>
                    </div>
                    {/* Active Programs and Success Rate removed - requires more APIs */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    Assigned Clients ({assignedClients.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignedClients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No clients assigned to this user.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assignedClients.map((client) => (
                        <Card key={client.id} className="border-none shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-blue-700">
                                {client.fullName}
                              </h3>
                              {/* Assuming client.programs exists and is an array */}
                              <Badge className="bg-teal-100 text-teal-700">
                                {client.programs?.length || 0} Programs
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                Added: {formatDate(client.createdAt)}
                              </span>{" "}
                              {/* Use helper */}
                            </div>
                            {client.notes && (
                              <div className="mt-2 p-2 bg-gray-500/10 rounded text-xs text-gray-600 italic line-clamp-2">
                                "{client.notes}"
                              </div>
                            )}
                            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                              <Link href={`/clients/${client.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  View Client
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-teal-600" />
                    Recent Activity (Placeholder)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* This component would need an API to fetch real user activity */}
                  <DoctorActivityTimeline activities={activityTimeline} />
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Activity data shown is static placeholder data as no API is
                    available.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions Card - always render, but disable buttons and pointer events if cannotEdit */}
          <Card
            className={`bg-white/90 border-none shadow-sm ${!canEdit ? "opacity-50 pointer-events-none" : ""}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="card-title text-base text-gray-700 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add New Client button - disabled if cannotEdit */}
              {viewedUser && ( // Ensure viewedUser exists before linking
                <Link
                  href={`/clients/new?userId=${viewedUser.id}`}
                  style={{ pointerEvents: canEdit ? "auto" : "none" }}
                >
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-xs h-8 justify-start"
                    disabled={!canEdit}
                  >
                    <Users className="h-3.5 w-3.5 mr-2" /> Add New Client for
                    This User
                  </Button>
                </Link>
              )}
              {/* Edit Profile button inside Quick Actions - disabled if cannotEdit */}
              <Link
                href={`/users/${id}/edit`}
                style={{ pointerEvents: canEdit ? "auto" : "none" }}
              >
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8 justify-start"
                  disabled={!canEdit}
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit Profile
                </Button>
              </Link>
              {/* Print Profile button - functionality not implemented, disabled if cannotEdit */}
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-700 text-xs h-8 justify-start"
                disabled={!canEdit}
              >
                <FileText className="h-3.5 w-3.5 mr-2" /> Print Profile
              </Button>
            </CardContent>
          </Card>

          {/* Account Security Card - always render, but disable the change password button if cannotEdit */}
          <Card className="bg-white/90 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="card-title text-base text-gray-700 flex items-center">
                <Key className="h-4 w-4 mr-2 text-teal-600" />
                Account Security (Static Data)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* These are static data as no API is available */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Password Status</span>
                  <Badge className="bg-green-100 text-green-700">Strong</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Last Password Change
                  </span>
                  <span className="text-sm text-gray-700">
                    {formatDate(viewedUser.updatedAt)}
                  </span>{" "}
                  {/* Using last updated as a placeholder */}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Two-Factor Auth</span>
                  <Badge className="bg-amber-100 text-amber-700">
                    Disabled
                  </Badge>{" "}
                  {/* Static */}
                </div>
                <div className="pt-2">
                  {/* Change Password button - functionality not implemented.
                       Always render, but disable the button and prevent pointer events if cannotEdit.
                    */}
                  <Link
                    href={`/users/${id}/change-password`}
                    style={{ pointerEvents: canEdit ? "auto" : "none" }}
                  >
                    {" "}
                    {/* Example link to a separate page */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-200 text-blue-600 text-xs"
                      disabled={!canEdit}
                    >
                      <Key className="h-3.5 w-3.5 mr-2" /> Change Password
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
