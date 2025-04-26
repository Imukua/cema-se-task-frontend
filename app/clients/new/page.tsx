"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import { clientApi } from "@/lib/api/clientApi";
import { ClientCreate, Client } from "@/lib/types/api";
import { useAuth } from "@/lib/auth/AuthContext"; // Import useAuth
import { Skeleton } from "@/components/ui/skeleton";

export default function NewClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth(); // Get user and auth loading state

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ClientCreate>({
    userId: undefined, // Initialize userId as undefined
    fullName: "",
    dob: "",
    gender: "Male",
    contact: "",
    notes: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    dob: "",
    contact: "",
    userId: "", // Add error state for userId
  });

  // Effect to set userId from authenticated user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userId: user.id,
      }));
       // Clear userId error if it was set
       if(errors.userId) {
           setErrors(prev => ({ ...prev, userId: "" }));
       }
    } else if (!isAuthLoading) {
       // If auth is not loading and no user, maybe handle this state
       // For this page, we assume user must be logged in via AuthProvider redirect
       // but setting an error ensures validation catches it if somehow not set.
       setErrors(prev => ({ ...prev, userId: "User not authenticated" }));
    }
  }, [user, isAuthLoading, errors.userId]); // Depend on user, isAuthLoading, and errors.userId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: "", dob: "", contact: "", userId: "" }; // Include userId error

    if (!formData.userId) {
        newErrors.userId = "Authenticated user is required to create a client.";
        isValid = false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    } else {
      try {
         const dobDate = new Date(formData.dob);
         const today = new Date();
         if (isNaN(dobDate.getTime()) || dobDate > today) {
           newErrors.dob = "Please enter a valid date of birth in the past";
           isValid = false;
         }
      } catch (e) {
         newErrors.dob = "Invalid date format";
         isValid = false;
      }
    }

    if (!formData.contact?.trim()) {
      newErrors.contact = "Contact information is required";
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
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Ensure userId is definitely set before sending
      if (!formData.userId) {
           // This case should ideally be caught by validateForm,
           // but a final check adds robustness.
           throw new Error("User ID is missing. Cannot create client.");
      }

      const createdClient = await clientApi.createClient(formData);

      toast({
        title: "Client Created",
        description: `${createdClient.fullName} has been successfully added.`,
        variant: "default",
      });

      router.push("/clients");
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: `Failed to create client. ${error.message || "Please try again."}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading skeleton or redirect if auth is loading and no user
  if (isAuthLoading) {
      return (
          <div className="space-y-6">
               <Skeleton className="h-8 w-64" />
               <Card className="bg-white/80 border-teal-100">
                   <CardHeader><Skeleton className="h-7 w-40" /></CardHeader>
                   <CardContent className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                       </div>
                       <Skeleton className="h-24 w-full" />
                   </CardContent>
                   <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
                       <Skeleton className="h-10 w-20" />
                       <Skeleton className="h-10 w-24" />
                   </CardFooter>
               </Card>
          </div>
      );
  }

  // If auth loading is complete but no user, this page shouldn't be accessible,
  // AuthProvider should handle redirection, but defensive check is good.
  if (!user) {
       // AuthProvider should typically handle redirecting unauthenticated users
       // If it doesn't, you might want a manual redirect here:
       // router.push('/login');
       return <div className="text-center py-12 text-red-600">Authentication required to view this page.</div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-teal-700">Add New Client</h1>
        <Link href="/clients">
          <Button variant="outline" className="border-blue-200 text-blue-600">
            Cancel
          </Button>
        </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">Client Information</CardTitle>
          <CardDescription className="text-blue-600">Enter the client's personal details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="new-client-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-blue-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className={errors.fullName ? "border-red-300" : ""}
                />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-blue-700">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className={errors.dob ? "border-red-300" : ""}
                />
                {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-blue-700">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={formData.gender} onValueChange={handleRadioChange} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-blue-700">
                  Contact <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Phone number or email"
                  className={errors.contact ? "border-red-300" : ""}
                />
                {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-blue-700">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes ?? ""}
                onChange={handleChange}
                placeholder="Any additional information about the client"
                className="min-h-[100px]"
              />
            </div>
             {errors.userId && <p className="text-sm text-red-500">{errors.userId}</p>} {/* Display userId error */}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          <Link href="/clients">
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="new-client-form" className="bg-teal-600 hover:bg-teal-700" disabled={isLoading || isAuthLoading || !user}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Client"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}