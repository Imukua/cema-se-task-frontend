"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { mockEnrollments, mockClients, mockPrograms } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, isAfter, isBefore } from "date-fns"
import { Search, Plus, Filter, X, CalendarIcon } from "lucide-react"

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [programFilter, setProgramFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | null
    to: Date | null
  }>({
    from: null,
    to: null,
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Simulate API call
    const fetchEnrollments = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          // Combine enrollment data with client and program data
          const enrichedEnrollments = mockEnrollments.map((enrollment) => {
            const client = mockClients.find((c) => c.id === enrollment.clientId)
            const program = mockPrograms.find((p) => p.id === enrollment.programId)

            return {
              ...enrollment,
              client,
              program,
            }
          })

          setEnrollments(enrichedEnrollments)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching enrollments:", error)
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  // Filter enrollments based on search term and filters
  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Search filter
    const matchesSearch =
      enrollment.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      enrollment.program?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    // Status filter
    const matchesStatus = !statusFilter || enrollment.status === statusFilter

    // Program filter
    const matchesProgram = !programFilter || enrollment.programId === programFilter

    // Date range filter
    let matchesDateRange = true
    if (dateRange.from) {
      matchesDateRange = matchesDateRange && isAfter(new Date(enrollment.enrolledAt), new Date(dateRange.from))
    }
    if (dateRange.to) {
      matchesDateRange = matchesDateRange && isBefore(new Date(enrollment.enrolledAt), new Date(dateRange.to))
    }

    return matchesSearch && matchesStatus && matchesProgram && matchesDateRange
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentEnrollments = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const resetFilters = () => {
    setStatusFilter(null)
    setProgramFilter(null)
    setDateRange({ from: null, to: null })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "dropped":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white/70">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by client or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus-visible:ring-teal-500 rounded-full"
              />
            </div>
            <div className="flex gap-2">
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filters
                    <Badge className="ml-1 bg-teal-100 text-teal-700 hover:bg-teal-200">
                      {(statusFilter ? 1 : 0) + (programFilter ? 1 : 0) + (dateRange.from || dateRange.to ? 1 : 0)}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2"
                      >
                        Reset all
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Status</label>
                      <Select
                        value={statusFilter || "all"}
                        onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="dropped">Dropped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Program</label>
                      <Select
                        value={programFilter || "all"}
                        onValueChange={(value) => setProgramFilter(value === "all" ? null : value)}
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="All programs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All programs</SelectItem>
                          {mockPrograms.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Enrollment Date Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start text-left font-normal h-8 text-xs"
                            >
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {dateRange.from ? format(dateRange.from, "PP") : "From"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.from || undefined}
                              onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start text-left font-normal h-8 text-xs"
                            >
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {dateRange.to ? format(dateRange.to, "PP") : "To"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.to || undefined}
                              onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={() => setShowFilters(false)} className="text-xs h-8">
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowFilters(false)}
                        className="text-xs h-8 bg-teal-600 hover:bg-teal-700"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Link href="/enrollments/new">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs h-9 px-3 flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  New Enrollment
                </Button>
              </Link>
            </div>
          </div>

          {/* Active filters display */}
          {(statusFilter || programFilter || dateRange.from || dateRange.to) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {statusFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter(null)} />
                </Badge>
              )}

              {programFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Program: {mockPrograms.find((p) => p.id === programFilter)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setProgramFilter(null)} />
                </Badge>
              )}

              {(dateRange.from || dateRange.to) && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Date: {dateRange.from ? format(dateRange.from, "PP") : "Any"} -{" "}
                  {dateRange.to ? format(dateRange.to, "PP") : "Any"}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDateRange({ from: null, to: null })} />
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs h-6 px-2 text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white/90">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-gray-700">
              Enrollments
              <Badge className="ml-2 bg-gray-100 text-gray-600 font-normal">{filteredEnrollments.length}</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-600 font-medium">Client</TableHead>
                      <TableHead className="text-gray-600 font-medium">Program</TableHead>
                      <TableHead className="text-gray-600 font-medium">Status</TableHead>
                      <TableHead className="text-gray-600 font-medium">Enrolled Date</TableHead>
                      <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEnrollments.length > 0 ? (
                      currentEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id} className="hover:bg-gray-50/80 border-b border-gray-100">
                          <TableCell>
                            <Link
                              href={`/clients/${enrollment.clientId}`}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {enrollment.client?.fullName || "Unknown Client"}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/programs/${enrollment.programId}`}
                              className="text-teal-600 hover:text-teal-800 hover:underline"
                            >
                              {enrollment.program?.name || "Unknown Program"}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadgeClass(enrollment.status)} text-xs`}>
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(enrollment.enrolledAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/enrollments/${enrollment.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2"
                              >
                                View Details
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No enrollments found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredEnrollments.length > itemsPerPage && (
                <div className="flex justify-center py-4 border-t border-gray-100">
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 border-gray-200"
                    >
                      &lt;
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={
                          currentPage === page
                            ? "h-8 w-8 p-0 bg-teal-600 hover:bg-teal-700"
                            : "h-8 w-8 p-0 border-gray-200"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 border-gray-200"
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
