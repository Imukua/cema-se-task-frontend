"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Import API service
import { clientApi } from "@/lib/api/clientApi";
// Assume necessary types like Client and ClientUpdate exist
import { Client, ClientUpdate } from "@/lib/types/api";


export default function EditClientPage() { // Renamed component
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams() as { id: string }; // Get client ID from URL

  const [client, setClient] = useState<Client | null>(null);
  const [loadingData, setLoadingData] = useState(true); // Loading state for fetching initial data
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // Assuming ClientUpdate includes these fields and they might be optional
  // Initialize with empty strings/default values
  const [formData, setFormData] = useState<ClientUpdate>({
    fullName: "",
    dob: "",
    gender: "Male", // Assuming a default value for gender
    contact: "",
    notes: "", // Assuming notes can be null or undefined
    // userId is typically not updated via a client edit form, so omit it
  });

  const [errors, setErrors] = useState({
    fullName: "",
    dob: "",
    contact: "",
    // Add error states for other required fields for update if necessary
  });

  // Effect to fetch client data on component mount or ID change
  useEffect(() => {
    const fetchClient = async () => {
      setLoadingData(true);
      try {
        // Assume clientApi.getClient exists
        const fetchedClient: Client = await clientApi.getClient(id);
        setClient(fetchedClient);
        // Pre-populate form with fetched data
        setFormData({
          fullName: fetchedClient.fullName,
          dob: fetchedClient.dob, // Assuming dob is a string format compatible with input type="date"
          gender: fetchedClient.gender || "Male", // Use fetched gender or default
          contact: fetchedClient.contact,
          notes: fetchedClient.notes || "", // Handle null/undefined notes
        });
      } catch (error) {
        console.error("Error fetching client:", error);
        setClient(null); // Indicate client not found
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id]); // Re-run effect if ID changes

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleRadioChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  }, []);

  const validateForm = () => {
    let isValid = true;
    // Update with all required fields for update. Assuming fullName, dob, contact are required for update.
    const newErrors = { fullName: "", dob: "", contact: "" };

    if (!formData.fullName?.trim()) { // Use optional chaining as ClientUpdate might have optional fields
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.dob?.trim()) { // dob is likely required for update as well
      newErrors.dob = "Date of birth is required";
      isValid = false;
    } else {
      try {
         const dobDate = new Date(formData.dob);
         const today = new Date();
         // Basic validation: check if date is valid and not in the future
         if (isNaN(dobDate.getTime()) || dobDate > today) {
           newErrors.dob = "Please enter a valid date of birth in the past";
           isValid = false;
         }
      } catch (e) {
         newErrors.dob = "Invalid date format";
         isValid = false;
      }
    }

    if (!formData.contact?.trim()) { // contact is likely required for update as well
      newErrors.contact = "Contact information is required";
      isValid = false;
    }

    // Add validation for other required fields here

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
      // Call the actual API to update the client
      // Assume clientApi.updateClient exists and takes clientId and ClientUpdate object
      const updatedClient: Client = await clientApi.updateClient(id, formData);

      toast({
        title: "Client Updated",
        description: `${updatedClient.fullName} has been successfully updated.`,
        variant: "default",
      });

      // Redirect to the client details page
      router.push(`/clients/${id}`);
    } catch (error: any) { // Use 'any' or a more specific error type if available
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: `Failed to update client. ${error.message || "Please try again."}`,
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

  // Show Client Not Found message if fetching failed or client is null
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Client Not Found</h1>
        <p className="text-gray-600 mb-6">The client you are looking for does not exist or an error occurred.</p>
        <Link href="/clients">
          <Button className="bg-teal-600 hover:bg-teal-700">Return to Clients List</Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="flex items-center gap-2">
              <Link href={`/clients/${id}`}> {/* Link back to client details */}
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-teal-700">Edit Client: {client.fullName}</h1>
         </div>
         {/* Cancel links back to client details */}
         <Link href={`/clients/${id}`}>
             <Button variant="outline" className="border-blue-200 text-blue-600">
                Cancel
             </Button>
         </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">Client Information</CardTitle>
          <CardDescription className="text-blue-600">Update the client's personal details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="edit-client-form" onSubmit={handleSubmit} className="space-y-6">
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
                value={formData.notes ?? ""} // Use ?? "" to handle potential null notes
                onChange={handleChange}
                placeholder="Any additional information about the client"
                className="min-h-[100px]"
              />
            </div>
             {/* userId error is removed as it's not required for update form */}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          {/* Cancel links back to client details */}
          <Link href={`/clients/${id}`}>
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="edit-client-form" className="bg-teal-600 hover:bg-teal-700" disabled={isLoading || loadingData || !client}>
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