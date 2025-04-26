"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, X } from "lucide-react";
import { userApi } from "@/lib/api/userApi";
import { User, PaginatedResponse } from "@/lib/types/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res: PaginatedResponse<User> = await userApi.getUsers(
        currentPage,
        itemsPerPage,
        appliedSearchTerm, // Pass applied search term to the backend
      );

      setUsers(res.results);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle specific errors like authentication or network issues
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Dependency array includes fetchUsers which changes when its dependencies (like appliedSearchTerm) change

  const handleApplySearch = () => {
    setCurrentPage(1); // Reset to page 1 when search is applied
    setAppliedSearchTerm(searchTerm); // Apply the search term, triggers fetchUsers
  };

  const resetSearch = () => {
    setSearchTerm("");
    setAppliedSearchTerm(""); // Reset applied search term, triggers fetchUsers
    setCurrentPage(1); // Reset to page 1
  };

  // Define handlePageChange function here
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };


  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white/70">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleApplySearch();
                  }
                }}
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
            <Link href="/users/new">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs h-9 px-3 flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add New User
              </Button>
            </Link>
          </div>

          {appliedSearchTerm && (
            <div className="flex flex-wrap gap-2 mt-3">
               <Badge
                 variant="outline"
                 className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1"
               >
                 Search: "{appliedSearchTerm}"
                 <X className="h-3 w-3 cursor-pointer" onClick={resetSearch} />
               </Badge>
            </div>
          )}

        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white/90">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-gray-700 font-playfair">
              Users
              <Badge className="ml-2 bg-gray-100 text-gray-600 font-normal">{users.length}</Badge> {/* Note: This badge shows count for the current page */}
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
          ) : users.length === 0 ? (
             <div className="text-center py-8 text-gray-500">
                No users found matching the criteria. Try adjusting your search.
             </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-600 font-medium">Name</TableHead>
                      <TableHead className="text-gray-600 font-medium">Email</TableHead>
                      <TableHead className="text-gray-600 font-medium">Role</TableHead>
                      <TableHead className="text-gray-600 font-medium">Created Date</TableHead>
                      <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50/80 border-b border-gray-100">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/users/${user.id}`}>
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
  );
}