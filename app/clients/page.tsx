"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { calculateAge } from "@/lib/utils"
import { mockClients, mockPrograms } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Search, Plus, Filter, X } from "lucide-react"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter states
  const [genderFilter, setGenderFilter] = useState<string | null>(null)
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100])
  const [programFilter, setProgramFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Simulate API call
    const fetchClients = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setClients(mockClients)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching clients:", error)
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Filter clients based on search term and filters
  const filteredClients = clients.filter((client) => {
    // Search filter
    const matchesSearch =
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || client.contact.includes(searchTerm)

    // Gender filter
    const matchesGender = !genderFilter || client.gender === genderFilter

    // Age filter
    const age = calculateAge(client.dob)
    const matchesAge = age >= ageRange[0] && age <= ageRange[1]

    // Program filter
    const matchesProgram = !programFilter || client.programs.some((program: any) => program.id === programFilter)

    return matchesSearch && matchesGender && matchesAge && matchesProgram
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const resetFilters = () => {
    setGenderFilter(null)
    setAgeRange([0, 100])
    setProgramFilter(null)
  }

  const handleAgeRangeChange = (value: number[]) => {
    setAgeRange([value[0], value[1]])
  }

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white/70">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients by name or contact..."
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
                      {(genderFilter ? 1 : 0) +
                        (programFilter ? 1 : 0) +
                        (ageRange[0] > 0 || ageRange[1] < 100 ? 1 : 0)}
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
                      <label className="text-xs font-medium text-gray-700">Gender</label>
                      <Select value={genderFilter || ""} onValueChange={(value) => setGenderFilter(value || null)}>
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="All genders" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All genders</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">Age range</label>
                        <span className="text-xs text-gray-500">
                          {ageRange[0]} - {ageRange[1]} years
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 100]}
                        value={[ageRange[0], ageRange[1]]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleAgeRangeChange}
                        className="py-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Program</label>
                      <Select value={programFilter || ""} onValueChange={(value) => setProgramFilter(value || null)}>
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

              <Link href="/clients/new">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs h-9 px-3 flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add Client
                </Button>
              </Link>
            </div>
          </div>

          {/* Active filters display */}
          {(genderFilter || programFilter || ageRange[0] > 0 || ageRange[1] < 100) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {genderFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Gender: {genderFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setGenderFilter(null)} />
                </Badge>
              )}

              {(ageRange[0] > 0 || ageRange[1] < 100) && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Age: {ageRange[0]} - {ageRange[1]} years
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setAgeRange([0, 100])} />
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
              Clients
              <Badge className="ml-2 bg-gray-100 text-gray-600 font-normal">{filteredClients.length}</Badge>
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
                      <TableHead className="text-gray-600 font-medium">Name</TableHead>
                      <TableHead className="text-gray-600 font-medium">Age</TableHead>
                      <TableHead className="text-gray-600 font-medium">Gender</TableHead>
                      <TableHead className="text-gray-600 font-medium">Contact</TableHead>
                      <TableHead className="text-gray-600 font-medium">Programs</TableHead>
                      <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentClients.length > 0 ? (
                      currentClients.map((client) => (
                        <TableRow key={client.id} className="hover:bg-gray-50/80 border-b border-gray-100">
                          <TableCell className="font-medium text-gray-700">{client.fullName}</TableCell>
                          <TableCell>{calculateAge(client.dob)} years</TableCell>
                          <TableCell>{client.gender}</TableCell>
                          <TableCell>{client.contact}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {client.programs.map((program: any) => (
                                <Badge
                                  key={program.id}
                                  variant="outline"
                                  className="bg-teal-50 text-teal-700 border-teal-200 text-xs"
                                >
                                  {program.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/clients/${client.id}`}>
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
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No clients found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredClients.length > itemsPerPage && (
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
