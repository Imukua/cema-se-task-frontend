"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { mockPrograms, mockEnrollments } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Search, Plus, Filter, X, CalendarIcon } from "lucide-react"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter states
  const [dateFilter, setDateFilter] = useState<Date | null>(null)
  const [enrollmentCountFilter, setEnrollmentCountFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Calculated enrollment counts for each program
  const [programEnrollments, setProgramEnrollments] = useState<Record<string, number>>({})

  useEffect(() => {
    // Simulate API call
    const fetchPrograms = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setPrograms(mockPrograms)

          // Calculate enrollment counts for each program
          const enrollmentCounts: Record<string, number> = {}
          mockPrograms.forEach((program) => {
            enrollmentCounts[program.id] = mockEnrollments.filter((e) => e.programId === program.id).length
          })
          setProgramEnrollments(enrollmentCounts)

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching programs:", error)
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  // Filter programs based on search term and filters
  const filteredPrograms = programs.filter((program) => {
    // Search filter
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase()))

    // Date filter
    const matchesDate = !dateFilter || new Date(program.createdAt).toDateString() === dateFilter.toDateString()

    // Enrollment count filter
    let matchesEnrollmentCount = true
    if (enrollmentCountFilter) {
      const count = programEnrollments[program.id] || 0
      if (enrollmentCountFilter === "none" && count > 0) matchesEnrollmentCount = false
      if (enrollmentCountFilter === "low" && (count < 1 || count > 5)) matchesEnrollmentCount = false
      if (enrollmentCountFilter === "medium" && (count < 6 || count > 15)) matchesEnrollmentCount = false
      if (enrollmentCountFilter === "high" && count < 16) matchesEnrollmentCount = false
    }

    return matchesSearch && matchesDate && matchesEnrollmentCount
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPrograms = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const resetFilters = () => {
    setDateFilter(null)
    setEnrollmentCountFilter(null)
  }

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white/70">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search programs by name or description..."
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
                      {(dateFilter ? 1 : 0) + (enrollmentCountFilter ? 1 : 0)}
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
                      <label className="text-xs font-medium text-gray-700">Created Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left font-normal h-8 text-xs"
                          >
                            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                            {dateFilter ? format(dateFilter, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateFilter || undefined}
                            onSelect={setDateFilter}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Enrollment Count</label>
                      <Select
                        value={enrollmentCountFilter || ""}
                        onValueChange={(value) => setEnrollmentCountFilter(value || null)}
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="Any enrollment count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any enrollment count</SelectItem>
                          <SelectItem value="none">None (0)</SelectItem>
                          <SelectItem value="low">Low (1-5)</SelectItem>
                          <SelectItem value="medium">Medium (6-15)</SelectItem>
                          <SelectItem value="high">High (16+)</SelectItem>
                        </SelectContent>
                      </Select>
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

              <Link href="/programs/new">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs h-9 px-3 flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add Program
                </Button>
              </Link>
            </div>
          </div>

          {/* Active filters display */}
          {(dateFilter || enrollmentCountFilter) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {dateFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Date: {format(dateFilter, "PP")}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFilter(null)} />
                </Badge>
              )}

              {enrollmentCountFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Enrollments:{" "}
                  {enrollmentCountFilter === "none"
                    ? "None"
                    : enrollmentCountFilter === "low"
                      ? "Low (1-5)"
                      : enrollmentCountFilter === "medium"
                        ? "Medium (6-15)"
                        : "High (16+)"}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setEnrollmentCountFilter(null)} />
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
              Programs
              <Badge className="ml-2 bg-gray-100 text-gray-600 font-normal">{filteredPrograms.length}</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-600 font-medium">Program Name</TableHead>
                      <TableHead className="text-gray-600 font-medium">Description</TableHead>
                      <TableHead className="text-gray-600 font-medium">Created Date</TableHead>
                      <TableHead className="text-gray-600 font-medium">Enrollments</TableHead>
                      <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPrograms.length > 0 ? (
                      currentPrograms.map((program) => (
                        <TableRow key={program.id} className="hover:bg-gray-50/80 border-b border-gray-100">
                          <TableCell className="font-medium text-teal-700">{program.name}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {program.description || "No description available"}
                          </TableCell>
                          <TableCell>{new Date(program.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                programEnrollments[program.id] === 0
                                  ? "bg-gray-100 text-gray-600"
                                  : programEnrollments[program.id] < 6
                                    ? "bg-blue-100 text-blue-700"
                                    : programEnrollments[program.id] < 16
                                      ? "bg-teal-100 text-teal-700"
                                      : "bg-amber-100 text-amber-700"
                              } text-xs`}
                            >
                              {programEnrollments[program.id] || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/programs/${program.id}`}>
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
                          No programs found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredPrograms.length > itemsPerPage && (
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
