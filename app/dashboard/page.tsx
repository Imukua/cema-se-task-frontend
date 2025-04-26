"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  ClipboardList,
  Activity,
  Calendar,
  ArrowUpRight,
  UserPlus,
  ClipboardCheck,
  PlusCircle,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react"
import { EnrollmentDistributionChart } from "@/components/enrollment-distribution-chart"
import { ClientGrowthChart } from "@/components/client-growth-chart"
import { useAuth } from "@/lib/auth/AuthContext"
import { useAPI } from "@/lib/hooks/useAPI"
import type { Client, ClientStatistics } from "@/lib/types/api"

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [stats, setStats] = useState({
    totalClients: 0,
    activePrograms: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
  })
  const [enrollmentDistribution, setEnrollmentDistribution] = useState({
    active: 0,
    completed: 0,
    dropped: 0,
  })
  const [notifications, setNotifications] = useState<any[]>([])

  const { execute: fetchStatistics, loading: statsLoading, error: statsError } = useAPI<ClientStatistics>()

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch client statistics
        const statistics = await fetchStatistics("/clients/statistics")

        if (statistics) {
          setStats({
            totalClients: statistics.client.total,
            activePrograms: statistics.programs.total,
            totalEnrollments: statistics.enrollments.total,
            activeEnrollments: statistics.enrollments.distribution.active,
          })

          setEnrollmentDistribution({
            active: statistics.enrollments.distribution.active,
            completed: statistics.enrollments.distribution.completed,
            dropped: statistics.enrollments.distribution.dropped,
          })

          // Set recent clients
          setRecentClients(
            statistics.client.recent.map((client) => ({
              id: client.id,
              fullName: client.fullName,
              createdAt: client.createdAt,
              // Add placeholder values for required fields
              dob: "",
              gender: "",
              contact: "",
              notes: null,
              updatedAt: "",
              userId: "",
            })),
          )
        }

        // Mock notifications (these would come from a real API in a production app)
        setNotifications([
          {
            id: 1,
            type: "info",
            message: "New client was added",
            time: "2 hours ago",
          },
          {
            id: 2,
            type: "success",
            message: "A client completed their health program",
            time: "Yesterday",
          },
          {
            id: 3,
            type: "warning",
            message: "A client missed their appointment",
            time: "2 days ago",
          },
          {
            id: 4,
            type: "info",
            message: "New program was added",
            time: "3 days ago",
          },
        ])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [fetchStatistics])

  if (loading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
        <p className="text-gray-600 mb-6">{statsError.message}</p>
        <Button onClick={() => window.location.reload()} className="bg-teal-600 hover:bg-teal-700">
          Retry
        </Button>
      </div>
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-teal-700">Dashboard</h1>
          <Badge className="bg-teal-100 text-teal-700">{user?.role || "USER"}</Badge>
        </div>
        <p className="text-sm text-gray-500">
          Welcome back, <span className="font-medium text-blue-600">{user?.name || "Doctor"}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 border-none shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-blue-600">{stats.totalClients}</p>
                <Link href="/clients" className="text-xs text-blue-500 hover:underline flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-none shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="bg-teal-50 p-3 rounded-full mr-4">
              <ClipboardList className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Programs</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-teal-600">{stats.activePrograms}</p>
                <Link href="/programs" className="text-xs text-teal-500 hover:underline flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-none shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-blue-600">{stats.totalEnrollments}</p>
                <Link href="/enrollments" className="text-xs text-blue-500 hover:underline flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-none shadow-sm">
          <CardContent className="p-4 flex items-center">
            <div className="bg-teal-50 p-3 rounded-full mr-4">
              <Calendar className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Enrollments</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-teal-600">{stats.activeEnrollments}</p>
                <Link href="/enrollments" className="text-xs text-teal-500 hover:underline flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 border-none shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-medium text-gray-700 flex items-center justify-between">
              <span>Enrollment Distribution</span>
              <Link href="/enrollments" className="text-xs text-blue-500 hover:underline flex items-center">
                View All <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="h-64">
              <EnrollmentDistributionChart data={enrollmentDistribution} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-none shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-medium text-gray-700 flex items-center justify-between">
              <span>Client Growth</span>
              <Link href="/clients" className="text-xs text-blue-500 hover:underline flex items-center">
                View All <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="h-64">
              <ClientGrowthChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients and Active Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 border-none shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-medium text-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2 text-blue-600" />
                <span>Recent Clients</span>
              </div>
              <Link href="/clients" className="text-xs text-blue-500 hover:underline flex items-center">
                View All <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {recentClients.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex justify-between items-center py-2">
                    <div>
                      <h3 className="font-medium text-blue-700">{client.fullName}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Added {new Date(client.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/clients/${client.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No clients found. Add your first client to get started.
              </div>
            )}
            <div className="mt-3">
              <Link href="/clients/new">
                <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 text-xs h-8">
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Add New Client
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-none shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-medium text-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-blue-600" />
                <span>Recent Notifications</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start py-2">
                    <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No notifications found.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/90 border-none shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-base font-medium text-gray-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Link href="/clients/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8 justify-start">
                <UserPlus className="h-3.5 w-3.5 mr-2" /> Add New Client
              </Button>
            </Link>
            <Link href="/enrollments/new">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-xs h-8 justify-start">
                <ClipboardCheck className="h-3.5 w-3.5 mr-2" /> Create Enrollment
              </Button>
            </Link>
            <Link href="/programs/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8 justify-start">
                <PlusCircle className="h-3.5 w-3.5 mr-2" /> Add New Program
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
