"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockPrograms, mockEnrollments, mockClients } from "@/lib/mock-data"
import { ProgramStatsChart } from "@/components/program-stats-chart"

export default function ProgramDetailsPage() {
  const { id } = useParams()
  const [program, setProgram] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [enrolledClients, setEnrolledClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    dropped: 0,
  })

  useEffect(() => {
    // Simulate API call
    const fetchProgramData = async () => {
      setLoading(true)
      try {
        // In a real app, these would be API calls
        setTimeout(() => {
          const foundProgram = mockPrograms.find((p) => p.id === id)

          if (foundProgram) {
            setProgram(foundProgram)

            // Get enrollments for this program
            const programEnrollments = mockEnrollments.filter((e) => e.programId === id)
            setEnrollments(programEnrollments)

            // Get enrolled clients
            const clientIds = [...new Set(programEnrollments.map((e) => e.clientId))]
            const clients = mockClients.filter((c) => clientIds.includes(c.id))
            setEnrolledClients(clients)

            // Calculate stats
            const active = programEnrollments.filter((e) => e.status === "active").length
            const completed = programEnrollments.filter((e) => e.status === "completed").length
            const dropped = programEnrollments.filter((e) => e.status === "dropped").length

            setStats({
              total: programEnrollments.length,
              active,
              completed,
              dropped,
            })
          }

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching program data:", error)
        setLoading(false)
      }
    }

    if (id) {
      fetchProgramData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card className="bg-white/80 border-teal-100">
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Program Not Found</h1>
        <p className="text-gray-600 mb-6">The program you are looking for does not exist or has been removed.</p>
        <Link href="/programs">
          <Button className="bg-teal-600 hover:bg-teal-700">Return to Programs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-teal-700">Program Details</h1>
        <div className="flex gap-2">
          <Link href="/programs">
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Back to Programs
            </Button>
          </Link>
          <Link href={`/programs/${id}/edit`}>
            <Button className="bg-teal-600 hover:bg-teal-700">Edit Program</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/80 border-teal-100 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-teal-700">Program Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Program Name</h3>
                <p className="text-lg font-medium text-blue-700">{program.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-base text-blue-700">{program.description || "No description available"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                <p className="text-base text-blue-700">{new Date(program.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="text-base text-blue-700">{new Date(program.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-teal-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-teal-700">Enrollment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-md">
                <h3 className="text-sm font-medium text-teal-700 mb-1">Total Enrollments</h3>
                <p className="text-2xl font-bold text-teal-700">{stats.total}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-md">
                <h3 className="text-sm font-medium text-green-700 mb-1">Active Enrollments</h3>
                <p className="text-2xl font-bold text-green-700">{stats.active}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-700 mb-1">Completed</h3>
                <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-md">
                <h3 className="text-sm font-medium text-amber-700 mb-1">Dropped</h3>
                <p className="text-2xl font-bold text-amber-700">{stats.dropped}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-teal-700">Enrollment Statistics Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ProgramStatsChart stats={stats} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-teal-700">Enrolled Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700">
                All Clients
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
              >
                Inactive
              </TabsTrigger>
            </TabsList>

            {["all", "active", "inactive"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {enrolledClients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No clients enrolled in this program.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enrolledClients.map((client) => {
                      const clientEnrollment = enrollments.find((e) => e.clientId === client.id)
                      const isActive = clientEnrollment?.status === "active"

                      // Filter based on tab
                      if (status === "active" && !isActive) return null
                      if (status === "inactive" && isActive) return null

                      return (
                        <Card key={client.id} className="border-teal-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-blue-700">{client.fullName}</h3>
                              <Badge
                                className={
                                  clientEnrollment?.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : clientEnrollment?.status === "completed"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-amber-100 text-amber-700"
                                }
                              >
                                {clientEnrollment?.status || "unknown"}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              Enrolled:{" "}
                              {clientEnrollment
                                ? new Date(clientEnrollment.enrolledAt).toLocaleDateString()
                                : "Unknown"}
                            </div>
                            <div className="flex justify-end mt-2">
                              <Link href={`/clients/${client.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                >
                                  View Client
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
