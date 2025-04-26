"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUsers, mockClients } from "@/lib/mock-data"
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
} from "lucide-react"
import { DoctorActivityTimeline } from "@/components/doctor-activity-timeline"

export default function DoctorProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState<any>(null)
  const [assignedClients, setAssignedClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate API call
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // In a real app, these would be API calls
        setTimeout(() => {
          const foundUser = mockUsers.find((u) => u.id === id)
          if (foundUser) {
            setUser(foundUser)

            // Get clients assigned to this doctor
            const userClients = mockClients.filter((c) => c.userId === id)
            setAssignedClients(userClients)
          }
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    if (id) {
      fetchUserData()
    }
  }, [id])

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
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">The user you are looking for does not exist or has been removed.</p>
        <Link href="/users">
          <Button className="bg-teal-600 hover:bg-teal-700">Return to Users</Button>
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

  // Create mock activity timeline data
  const activityTimeline = [
    {
      id: "1",
      type: "login",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      title: "Logged into the system",
    },
    {
      id: "2",
      type: "client",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      title: "Added new client: Sarah Miller",
      clientName: "Sarah Miller",
    },
    {
      id: "3",
      type: "enrollment",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      title: "Created enrollment for John Smith",
      clientName: "John Smith",
      programName: "Diabetes Management",
    },
    {
      id: "4",
      type: "update",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      title: "Updated client information for Michael Johnson",
      clientName: "Michael Johnson",
    },
    {
      id: "5",
      type: "login",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      title: "Logged into the system",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/users">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="page-title text-teal-700">Doctor Profile</h1>
        </div>
        <Link href={`/users/${id}/edit`}>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Pencil className="h-4 w-4 mr-1" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Doctor Summary Card */}
        <Card className="bg-white/90 border-none shadow-sm lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-20 w-20 bg-blue-100 text-blue-700 text-xl">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 font-playfair">{user.name}</h2>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                      <span className="text-gray-300">•</span>
                      <Badge
                        className={user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"}
                      >
                        {user.role}
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
                      <p className="text-sm font-medium">{assignedClients.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-teal-50 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Status</p>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
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
                Assigned Clients
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Doctor Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" /> Full Name
                        </h3>
                        <p className="text-base font-medium text-blue-700">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" /> Email Address
                        </h3>
                        <p className="text-base font-medium text-blue-700">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Shield className="h-4 w-4 mr-1 text-gray-400" /> Role
                        </h3>
                        <p className="text-base font-medium text-blue-700">{user.role}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" /> Created Date
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" /> Last Updated
                        </h3>
                        <p className="text-base font-medium text-blue-700">
                          {new Date(user.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" /> Assigned Clients
                        </h3>
                        <p className="text-base font-medium text-blue-700">{assignedClients.length}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-md text-center">
                      <p className="text-3xl font-bold text-blue-700">{assignedClients.length}</p>
                      <p className="text-xs text-blue-600 mt-1">Total Clients</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-md text-center">
                      <p className="text-3xl font-bold text-teal-700">12</p>
                      <p className="text-xs text-teal-600 mt-1">Active Programs</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md text-center">
                      <p className="text-3xl font-bold text-blue-700">85%</p>
                      <p className="text-xs text-blue-600 mt-1">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <Card className="bg-white/90 border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="card-title text-base text-gray-700 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    Assigned Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignedClients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No clients assigned to this doctor.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assignedClients.map((client) => (
                        <Card key={client.id} className="border-none shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-blue-700">{client.fullName}</h3>
                              <Badge className="bg-teal-100 text-teal-700">{client.programs.length} Programs</Badge>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Added: {new Date(client.createdAt).toLocaleDateString()}</span>
                            </div>
                            {client.notes && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 italic line-clamp-2">
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
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DoctorActivityTimeline activities={activityTimeline} />
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
                <Settings className="h-4 w-4 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/clients/new?doctorId=${user.id}`}>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-xs h-8 justify-start">
                  <Users className="h-3.5 w-3.5 mr-2" /> Add New Client
                </Button>
              </Link>
              <Link href={`/users/${id}/edit`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8 justify-start">
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit Profile
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-gray-200 text-gray-700 text-xs h-8 justify-start">
                <FileText className="h-3.5 w-3.5 mr-2" /> Print Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="card-title text-base text-gray-700 flex items-center">
                <Key className="h-4 w-4 mr-2 text-teal-600" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Password Status</span>
                  <Badge className="bg-green-100 text-green-700">Strong</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Password Change</span>
                  <span className="text-sm text-gray-700">30 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Two-Factor Auth</span>
                  <Badge className="bg-amber-100 text-amber-700">Disabled</Badge>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 text-xs">
                    <Key className="h-3.5 w-3.5 mr-2" /> Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
