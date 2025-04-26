"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { calculateAge } from "@/lib/utils";
// Remove mock data imports
// import { mockClients, mockEnrollments } from "@/lib/mock-data"
import {
  User,
  Calendar,
  Phone,
  Clock,
  ClipboardList,
  Activity,
  ArrowLeft,
  Pencil,
  CheckCircle2,
  AlertCircle,
  FileText,
  CalendarClock,
} from "lucide-react";
import { ClientEnrollmentTimeline } from "@/components/client-enrollment-timeline";
// Import your clientApi service
import { clientApi } from "@/lib/api/clientApi";
// Import necessary types if available
import { Client } from "@/lib/types/api";

export default function ClientProfilePage() {
  const { id } = useParams();
  // Use the Client type if available, otherwise keep any or define a specific type
  const [client, setClient] = useState<Client | null>(null);
  // Enrollments are included within the client object from the API,
  // so we don't need a separate state for them initially, but we can
  // derive them from the client state for rendering.
  // const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        // Replace mock call with actual API call to get client by ID
        // Assuming clientApi has a getClientById function that fetches client with enrollments
        const fetchedClient: Client = await clientApi.getClient(id as string);

        if (fetchedClient) {
          setClient(fetchedClient);
          // Enrollments are nested in fetchedClient.programs, so no separate fetch needed
          // setEnrollments(fetchedClient.programs); // You can optionally store them separately if needed
        } else {
          setClient(null); // Set client to null if not found
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        setClient(null); // Set client to null on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]); // Dependency array includes id

  // Derive enrollments from the fetched client state
  const enrollments = client?.programs || [];

  if (loading) {
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
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Client Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The client you are looking for does not exist or has been removed.
        </p>
        <Link href="/clients">
          <Button className="bg-teal-600 hover:bg-teal-700">
            Return to Clients
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate enrollment statistics from the fetched enrollments
  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter(
    (e: any) => e.status === "active",
  ).length;
  const completedEnrollments = enrollments.filter(
    (e: any) => e.status === "completed",
  ).length;
  const droppedEnrollments = enrollments.filter(
    (e: any) => e.status === "dropped",
  ).length;

  // Generate initials from client name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/clients">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="page-title text-teal-700">Client Profile</h1>
        </div>
        <Link href={`/clients/${id}/edit`}>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Pencil className="h-4 w-4 mr-1" /> Edit Client
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Client Summary Card */}
        <Card className="bg-white/90 border-none shadow-sm lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-20 w-20 bg-teal-100 text-teal-700 text-xl">
                <AvatarFallback>{getInitials(client.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 font-playfair">
                      {client.fullName}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Calendar className="h-4 w-4" />
                      {/* Ensure client.dob is a valid Date object or string for calculateAge and toLocaleDateString */}
                      <span>
                        {new Date(client.dob).toLocaleDateString()} (
                        {calculateAge(client.dob)} years)
                      </span>
                      <span className="text-gray-300">•</span>
                      <Badge className="bg-blue-100 text-blue-700 font-normal">
                        {client.gender}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {/* Iterate through client.programs to display enrolled programs */}
                    {client.programs &&
                      client.programs.map((enrollment: any) => (
                        <Badge
                          key={enrollment.id}
                          className="bg-teal-100 text-teal-700 hover:bg-teal-200"
                        >
                          {/* Access the program name from the nested healthProgram object */}
                          {enrollment.healthProgram
                            ? enrollment.healthProgram.name
                            : "Unknown Program"}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm font-medium">{client.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-teal-50 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Client Since</p>
                      {/* Ensure client.createdAt is a valid Date object or string */}
                      <p className="text-sm font-medium">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <ClipboardList className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Programs Enrolled</p>
                      {/* Display the count of programs (enrollments) */}
                      <p className="text-sm font-medium">
                        {enrollments.length}
                      </p>
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
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="enrollments"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                Enrollments
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
              >
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Client Information
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
                          {client.fullName}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          Date of Birth
                        </h3>
                        {/* Ensure client.dob is a valid Date object or string */}
                        <p className="text-base font-medium text-blue-700">
                          {new Date(client.dob).toLocaleDateString()} (
                          {calculateAge(client.dob)} years)
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Badge className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          Gender
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {client.gender}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          Contact
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {client.contact}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          Created Date
                        </h3>
                        {/* Ensure client.createdAt is a valid Date object or string */}
                        <p className="text-base font-medium text-blue-700">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Activity className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          Last Updated
                        </h3>
                        {/* Ensure client.updatedAt is a valid Date object or string */}
                        <p className="text-base font-medium text-blue-700">
                          {new Date(client.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />{" "}
                        Notes
                      </h3>
                      <div className="p-4 bg-blue-50 rounded-md text-blue-700 text-sm">
                        {client.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <ClipboardList className="h-4 w-4 mr-2 text-blue-600" />
                    Program Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger
                        value="active"
                        className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
                      >
                        Active (
                        {
                          enrollments.filter((e: any) => e.status === "active")
                            .length
                        }
                        )
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                      >
                        Completed (
                        {
                          enrollments.filter(
                            (e: any) => e.status === "completed",
                          ).length
                        }
                        )
                      </TabsTrigger>
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700"
                      >
                        All ({enrollments.length})
                      </TabsTrigger>
                    </TabsList>

                    {["active", "completed", "all"].map((status) => (
                      <TabsContent
                        key={status}
                        value={status}
                        className="space-y-4"
                      >
                        {enrollments.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No enrollments found for this client.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {enrollments
                              .filter(
                                (e: any) =>
                                  status === "all" || e.status === status,
                              )
                              .map((enrollment) => (
                                <Card
                                  key={enrollment.id}
                                  className="border-none shadow-sm"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      {/* Access program name from nested healthProgram */}
                                      <h3 className="font-medium text-blue-700">
                                        {enrollment.healthProgram
                                          ? enrollment.healthProgram.name
                                          : "Unknown Program"}
                                      </h3>
                                      <Badge
                                        className={
                                          enrollment.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : enrollment.status === "completed"
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-amber-100 text-amber-700"
                                        }
                                      >
                                        {enrollment.status === "active" && (
                                          <Activity className="h-3 w-3 mr-1" />
                                        )}
                                        {enrollment.status === "completed" && (
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                        )}
                                        {enrollment.status === "dropped" && (
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {enrollment.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 mb-2">
                                      <CalendarClock className="h-3 w-3 mr-1" />
                                      {/* Ensure enrollment.enrolledAt is a valid Date object or string */}
                                      Enrolled:{" "}
                                      {new Date(
                                        enrollment.enrolledAt,
                                      ).toLocaleDateString()}
                                    </div>
                                    {enrollment.notes && (
                                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 italic">
                                        "{enrollment.notes}"
                                      </div>
                                    )}
                                    {/* Link to individual enrollment details page if needed */}
                                    <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                                      {/* Update this link if you have a specific enrollment view page */}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        View Details
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-teal-600" />
                    Client Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Pass the fetched enrollments and client creation date to the timeline component */}
                  <ClientEnrollmentTimeline
                    enrollments={enrollments}
                    clientCreatedAt={client.createdAt}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/90 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="card-title text-base text-gray-700 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Link to create new enrollment, pre-filling client ID */}
              <Link href={`/enrollments/new?clientId=${client.id}`}>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-xs h-8 justify-start">
                  <ClipboardList className="h-3.5 w-3.5 mr-2" /> Create
                  Enrollment
                </Button>
              </Link>
              {/* Link to edit client profile */}
              <Link href={`/clients/${id}/edit`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8 justify-start">
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit Client
                </Button>
              </Link>
              {/* Print Profile button - currently just a placeholder */}
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-700 text-xs h-8 justify-start"
              >
                <FileText className="h-3.5 w-3.5 mr-2" /> Print Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="card-title text-base text-gray-700 flex items-center">
                <ClipboardList className="h-4 w-4 mr-2 text-teal-600" />
                Enrollment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Total Enrollments
                  </span>
                  <Badge className="bg-gray-100 text-gray-700">
                    {totalEnrollments}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Activity className="h-3 w-3 mr-1 text-green-500" /> Active
                  </span>
                  <Badge className="bg-green-100 text-green-700">
                    {activeEnrollments}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-blue-500" />{" "}
                    Completed
                  </span>
                  <Badge className="bg-blue-100 text-blue-700">
                    {completedEnrollments}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />{" "}
                    Dropped
                  </span>
                  <Badge className="bg-amber-100 text-amber-700">
                    {droppedEnrollments}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
