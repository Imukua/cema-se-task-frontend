"use client";

import { useState, useEffect, useCallback, useRef } from "react"; // Import useRef
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateAge } from "@/lib/utils";
// import { mockPrograms } from "@/lib/mock-data"; // Assuming this is not needed for fetching programs via API
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Search, Plus, Filter, X } from "lucide-react";
import { clientApi } from "@/lib/api/clientApi";
import { Client, HealthProgram, PaginatedResponse } from "@/lib/types/api";
import { programApi } from "@/lib/api/programApi";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for the input value
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // State for the debounced search term

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [appliedGenderFilter, setAppliedGenderFilter] = useState<
    string | undefined
  >(undefined);
  const [appliedProgramFilter, setAppliedProgramFilter] = useState<
    string | undefined
  >(undefined);

  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  const [frontendFilteredClients, setFrontendFilteredClients] = useState<
    Client[]
  >([]);

  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [programFilter, setProgramFilter] = useState<string | null>(null);
  const [programs, setPrograms] = useState<HealthProgram[]>([]);

  // Debounce delay in milliseconds
  const debounceDelay = 500; // Adjust as needed

  // Use useRef to keep track of the debounce timeout ID
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch clients based on applied filters and search term
  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      // This function now uses appliedSearchTerm, which will be updated by the debounced effect
      const res: PaginatedResponse<Client> = await clientApi.getClients(
        currentPage,
        itemsPerPage,
        appliedSearchTerm, // Use the applied (debounced) search term
        appliedGenderFilter?.toLowerCase(),
        undefined // Assuming no other server-side filters like age or program
      );

      setClients(res.results);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error loading clients:", error);
      // Optionally handle error state
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchTerm, appliedGenderFilter]); // Depend on appliedSearchTerm

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await programApi.getPrograms();
      setPrograms(res.results);
    } catch (error) {
      console.error("Error loading programs:", error);
    }
  }, []);

  // Effect to fetch clients when pagination, applied search term, or applied gender filter changes
  useEffect(() => {
    fetchClients();
  }, [fetchClients]); // Dependency on fetchClients which includes appliedSearchTerm and appliedGenderFilter

  // Effect to fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Effect to debounce the search term and trigger client fetch
  useEffect(() => {
    // Clear the previous timeout if the search term changes before the delay
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      // Only update appliedSearchTerm (which triggers fetchClients) if the search term is not empty
      // or if it was previously not empty and is now empty (to clear results)
      if (searchTerm !== appliedSearchTerm) {
        setCurrentPage(1); // Reset pagination on new search
        setAppliedSearchTerm(searchTerm);
      }
    }, debounceDelay);

    // Cleanup the timeout when the component unmounts or searchTerm changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, debounceDelay, appliedSearchTerm]); // Depend on searchTerm and debounceDelay

  // Effect for frontend filtering (age and program are filtered client-side based on the fetched data)
  useEffect(() => {
    const filtered = clients.filter((client) => {
      const age = calculateAge(client.dob);
      const matchesAge = age >= ageRange[0] && age <= ageRange[1];

      const matchesProgram =
        !appliedProgramFilter || // If no program filter is applied
        (client.programs && // If client has programs
          client.programs.some(
            // Check if any of the client's programs match the filter
            (enrollment: any) => enrollment.programId === appliedProgramFilter
          ));

      return matchesAge && matchesProgram;
    });
    setFrontendFilteredClients(filtered);
    // Note: Pagination is handled by the backend fetchClients, frontend filtering happens on the current page's data
    // If you want frontend filtering to affect pagination, you would need to fetch ALL clients first,
    // which might not be performant for large datasets. The current approach filters the clients fetched for the *current page*.
  }, [clients, ageRange, appliedProgramFilter]); // Depend on clients, ageRange, and appliedProgramFilter

  // handleApplySearch button is removed, search is now automatic with debounce

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset pagination when filters are applied
    setAppliedGenderFilter(
      genderFilter === null || genderFilter === "" || genderFilter === "all"
        ? undefined
        : genderFilter
    );
    setAppliedProgramFilter(
      programFilter === null || programFilter === "" || programFilter === "all"
        ? undefined
        : programFilter
    );

    setShowFilters(false);
    // The change in appliedGenderFilter and appliedProgramFilter will trigger fetchClients via useEffect
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const resetFilters = () => {
    // Reset filter states
    setGenderFilter(null);
    setAgeRange([0, 100]);
    setProgramFilter(null);
    // Reset applied filter states (this will trigger fetchClients)
    setAppliedGenderFilter(undefined);
    setAppliedProgramFilter(undefined);
    // Reset search term (this will trigger the debounce effect)
    setSearchTerm("");
    setAppliedSearchTerm(""); // Directly reset applied search term to ensure immediate effect
    setCurrentPage(1); // Reset pagination
  };

  const handleAgeRangeChange = (value: number[]) => {
    setAgeRange([value[0], value[1]]);
  };

  const handleGenderFilterChange = (value: string) => {
    setGenderFilter(value);
  };

  const handleProgramFilterChange = (value: string) => {
    setProgramFilter(value);
  };

  const displayClients = frontendFilteredClients; // Display the frontend filtered clients

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white/70">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients by name or contact..."
                value={searchTerm} // Input is controlled by searchTerm
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
                className="pl-9 bg-white border-gray-200 focus-visible:ring-teal-500 rounded-full flex-grow"
              />
              {/* Removed the Search button */}
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
                      {(appliedGenderFilter ? 1 : 0) +
                        (appliedProgramFilter ? 1 : 0) +
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
                      <label className="text-xs font-medium text-gray-700">
                        Gender
                      </label>
                      <Select
                        value={genderFilter === null ? "" : genderFilter}
                        onValueChange={handleGenderFilterChange}
                      >
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
                        <label className="text-xs font-medium text-gray-700">
                          Age range
                        </label>
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
                      <label className="text-xs font-medium text-gray-700">
                        Program
                      </label>
                      <Select
                        value={programFilter === null ? "" : programFilter}
                        onValueChange={handleProgramFilterChange}
                      >
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue placeholder="programs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All programs</SelectItem>
                          {programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                        className="text-xs h-8"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleApplyFilters}
                        className="text-xs h-8 bg-teal-600 hover:bg-teal-700"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Link href="/clients/new">
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-xs h-9 px-3 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Client
                </Button>
              </Link>
            </div>
          </div>

          {(appliedGenderFilter ||
            appliedProgramFilter ||
            ageRange[0] > 0 ||
            ageRange[1] < 100) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {appliedGenderFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Gender: {appliedGenderFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setAppliedGenderFilter(undefined);
                      setGenderFilter(null);
                      setCurrentPage(1); // Reset pagination when removing a filter
                    }}
                  />
                </Badge>
              )}

              {(ageRange[0] > 0 || ageRange[1] < 100) && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Age: {ageRange[0]} - {ageRange[1]} years
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setAgeRange([0, 100])}
                  />
                </Badge>
              )}

              {appliedProgramFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Program:{" "}
                  {programs.find((p) => p.id === appliedProgramFilter)?.name ||
                    "Unknown Program"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setAppliedProgramFilter(undefined);
                      setProgramFilter(null);
                      setCurrentPage(1); // Reset pagination when removing a filter
                    }}
                  />
                </Badge>
              )}

              {(appliedGenderFilter ||
                appliedProgramFilter ||
                ageRange[0] > 0 ||
                ageRange[1] < 100) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs h-6 px-2 text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white/90">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-gray-700">
              Clients
              <Badge className="ml-2 bg-gray-100 text-gray-600 font-normal">
                {loading ? (
                  <Skeleton className="h-4 w-10" />
                ) : (
                  frontendFilteredClients.length
                )}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayClients.length === 0 &&
            (appliedSearchTerm !== "" ||
              appliedGenderFilter !== undefined ||
              appliedProgramFilter !== undefined ||
              ageRange[0] > 0 ||
              ageRange[1] < 100) ? (
            <div className="text-center py-8 text-gray-500">
              No clients found matching your search or filter criteria.
            </div>
          ) : displayClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No clients available. Add a new client to get started.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-600 font-medium">
                        Name
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium">
                        Age
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium">
                        Gender
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium">
                        Contact
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium">
                        Programs
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayClients.map((client) => (
                      <TableRow
                        key={client.id}
                        className="hover:bg-gray-50/80 border-b border-gray-100"
                      >
                        <TableCell className="font-medium text-gray-700">
                          {client.fullName}
                        </TableCell>
                        <TableCell>{calculateAge(client.dob)} years</TableCell>
                        <TableCell>{client.gender}</TableCell>
                        <TableCell>{client.contact}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {client.programs &&
                              client.programs.map((enrollment: any) => (
                                <Badge
                                  key={enrollment.id}
                                  variant="outline"
                                  className="bg-teal-50 text-teal-700 border-teal-200 text-xs"
                                >
                                  {enrollment.healthProgram
                                    ? enrollment.healthProgram.name
                                    : "Unknown Program"}
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
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
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
                      )
                    )}
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
  );
}
