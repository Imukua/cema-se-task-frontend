"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { Search, Plus, Filter, X, CalendarIcon } from "lucide-react";
import { programApi } from "@/lib/api/programApi";
import { HealthProgram, PaginatedResponse } from "@/lib/types/api";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const res: PaginatedResponse<HealthProgram> =
        await programApi.getPrograms(
          currentPage,
          itemsPerPage,
          appliedSearchTerm,
        );

      setPrograms(res.results);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchTerm]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const filteredPrograms = programs.filter((program) => {
    const matchesDate =
      !dateFilter || isSameDay(new Date(program.createdAt), dateFilter);

    return matchesDate;
  });

  const handleApplySearch = () => {
    setCurrentPage(1);
    setAppliedSearchTerm(searchTerm);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const resetFilters = () => {
    setDateFilter(undefined);
    setSearchTerm("");
    setAppliedSearchTerm("");
    setCurrentPage(1);
  };

  const displayPrograms = filteredPrograms;

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white/70">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search programs by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus-visible:ring-teal-500 rounded-full flex-grow"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplySearch}
                className="ml-2 h-9 text-xs border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full"
              >
                Search
              </Button>
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
                      {dateFilter ? 1 : 0}
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
                        Created Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left font-normal h-8 text-xs"
                          >
                            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                            {dateFilter
                              ? format(dateFilter, "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateFilter}
                            onSelect={setDateFilter}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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

              <Link href="/programs/new">
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-xs h-9 px-3 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Program
                </Button>
              </Link>
            </div>
          </div>

          {(dateFilter || appliedSearchTerm) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {appliedSearchTerm && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Search: "{appliedSearchTerm}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSearchTerm("");
                      setAppliedSearchTerm("");
                      setCurrentPage(1);
                    }}
                  />
                </Badge>
              )}
              {dateFilter && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
                >
                  Created Date: {format(dateFilter, "PP")}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setDateFilter(undefined)}
                  />
                </Badge>
              )}

              {(dateFilter || appliedSearchTerm) && (
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
              Programs
              <Badge className="ml-2 bg-gray-100 text-gray-600 font-normal">
                {filteredPrograms.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : displayPrograms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No programs found matching the criteria. Try adjusting your search
              or filters.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-600 font-medium">
                        Program Name
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium">
                        Created Date
                      </TableHead>
                      <TableHead className="text-gray-600 font-medium text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrograms.length > 0 ? (
                      filteredPrograms.map((program) => (
                        <TableRow
                          key={program.id}
                          className="hover:bg-gray-50/80 border-b border-gray-100"
                        >
                          <TableCell className="font-medium text-teal-700">
                            {program.name}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {program.description || "No description available"}
                          </TableCell>
                          <TableCell>
                            {new Date(program.createdAt).toLocaleDateString()}
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
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-gray-500"
                        >
                          No programs found. Try adjusting your search or
                          filters.
                        </TableCell>
                      </TableRow>
                    )}
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
                      ),
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
