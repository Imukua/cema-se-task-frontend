"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import API service
import { userApi } from "@/lib/api/userApi";
// Assume necessary types like User and UserUpdate exist
import { User as UserType, UserUpdate } from "@/lib/types/api";


export default function EditUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams() as { id: string }; // Get user ID from URL

  const [user, setUser] = useState<UserType | null>(null);
  const [loadingData, setLoadingData] = useState(true); // Loading state for fetching initial data
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // Include password and confirmPassword in formData state
  const [formData, setFormData] = useState<UserUpdate & { password?: string, confirmPassword?: string }>({
    name: "",
    email: "",
    role: "USER",
    password: "", // Add password field
    confirmPassword: "", // Add confirm password field
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    password: "", // Add password error state
    confirmPassword: "", // Add confirm password error state
  });

  // Effect to fetch user data on component mount or ID change
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingData(true);
      try {
        const fetchedUser: UserType = await userApi.getUser(id);
        setUser(fetchedUser);
        // Pre-populate form with fetched data (excluding password)
        setFormData(prev => ({
          ...prev, // Keep password/confirmPassword empty for editing
          name: fetchedUser.name,
          email: fetchedUser.email,
          role: fetchedUser.role,
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Indicate user not found
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]); // Re-run effect if ID changes

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [errors]); // Depend on errors to correctly clear them

   const handleSelectChange = useCallback((name: keyof typeof formData, value: string) => {
     setFormData((prev) => ({
       ...prev,
       [name]: value,
     }));

     // Clear error when user selects (assuming role is the only select for now)
     if (name === 'role' && errors.role) {
        setErrors(prev => ({ ...prev, role: "" }));
     }
   }, [errors.role]);


  const validateForm = () => {
    let isValid = true;
    // Include password and confirmPassword errors in validation state
    const newErrors = { name: "", email: "", role: "", password: "", confirmPassword: "" };

    if (!formData.name?.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
       newErrors.email = "Please enter a valid email address";
       isValid = false;
    }

     if (!formData.role) {
        newErrors.role = "Role is required";
        isValid = false;
     }

    // Password validation - only if password field is not empty
    if (formData.password) {
        if (formData.password.length < 8) { // Example: Minimum 8 characters
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }
    } else if (formData.confirmPassword) {
        // If confirm password is entered but password is not
         newErrors.password = "Please enter a password";
         isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
        toast({
            title: "Validation Error",
            description: "Please fix the errors in the form.",
            variant: "destructive",
        });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data to send to the API
      const dataToUpdate: UserUpdate = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          // Only include password if it was entered (meaning user intends to change it)
          ...(formData.password && { password: formData.password }),
          // Do NOT send confirmPassword to the API
      };

      // Call the actual API to update the user
      const updatedUser: UserType = await userApi.updateUser(id, dataToUpdate);

      toast({
        title: "User Updated",
        description: `${updatedUser.name}'s profile has been successfully updated.`,
        variant: "default",
      });

      // Redirect to the user details page
      router.push(`/users/${id}`);
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: `Failed to update user. ${error.message || "Please try again."}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading skeleton while fetching initial data
  if (loadingData) {
     return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-10 w-24" />
            </div>
            <Card className="bg-white/80 border-teal-100">
                 <CardHeader><Skeleton className="h-7 w-40" /></CardHeader>
                 <CardContent className="space-y-6">
                      <Skeleton className="h-12 w-full" /> {/* Name Input */}
                      <Skeleton className="h-12 w-full" /> {/* Email Input */}
                      <Skeleton className="h-12 w-full" /> {/* Role Select */}
                      <Skeleton className="h-12 w-full" /> {/* Password Input */}
                      <Skeleton className="h-12 w-full" /> {/* Confirm Password Input */}
                 </CardContent>
                 <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-24" />
                 </CardFooter>
            </Card>
        </div>
     );
  }

  // Show User Not Found message if fetching failed or user is null
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">The user you are looking for does not exist or an error occurred.</p>
        <Link href="/users">
          <Button className="bg-teal-600 hover:bg-teal-700">Return to Users List</Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="flex items-center gap-2">
              <Link href={`/users/${id}`}> {/* Link back to user details */}
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-teal-700">Edit User: {user.name}</h1>
         </div>
         {/* Cancel links back to user details */}
         <Link href={`/users/${id}`}>
             <Button variant="outline" className="border-blue-200 text-blue-600">
                Cancel
             </Button>
         </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">User Information</CardTitle>
          <CardDescription className="text-blue-600">Update the user's profile details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className={errors.name ? "border-red-300" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.smith@example.com"
                  className={errors.email ? "border-red-300" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

               <div className="space-y-2">
                 <Label htmlFor="role" className="text-blue-700">
                   Role <span className="text-red-500">*</span>
                 </Label>
                 <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                    <SelectTrigger className={errors.role ? "border-red-300" : ""}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="USER">User</SelectItem>
                       <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                 </Select>
                 {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
               </div>

                {/* Password Fields */}
               <div className="space-y-2">
                 <Label htmlFor="password" className="text-blue-700">
                   New Password
                 </Label>
                 <Input
                   id="password"
                   name="password"
                   type="password"
                   value={formData.password}
                   onChange={handleChange}
                   placeholder="Enter new password (optional)"
                   className={errors.password ? "border-red-300" : ""}
                 />
                 {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
               </div>

               <div className="space-y-2">
                 <Label htmlFor="confirmPassword" className="text-blue-700">
                   Confirm New Password
                 </Label>
                 <Input
                   id="confirmPassword"
                   name="confirmPassword"
                   type="password"
                   value={formData.confirmPassword}
                   onChange={handleChange}
                   placeholder="Confirm new password"
                   className={errors.confirmPassword ? "border-red-300" : ""}
                 />
                 {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
               </div>

            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          {/* Cancel links back to user details */}
          <Link href={`/users/${id}`}>
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="edit-user-form" className="bg-teal-600 hover:bg-teal-700" disabled={isLoading || loadingData || !user}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}