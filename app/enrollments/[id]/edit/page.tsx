"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Import API services
import { clientApi } from "@/lib/api/clientApi";
import { programApi } from "@/lib/api/programApi";
// Assume enrollmentApi exists with getEnrollment and updateEnrollment methods
import { enrollmentApi } from "@/lib/api/enrollmentApi";

// Import types
import {
  Client,
  HealthProgram,
  Enrollment,
  EnrollmentUpdate,
  PaginatedResponse,
} from "@/lib/types/api";

export default function EditEnrollmentPage() {
  // Renamed component
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams() as { id: string }; // Get enrollment ID from URL

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [clients, setClients] = useState<Client[]>([]); // Needed to display client name
  const [programs, setPrograms] = useState<HealthProgram[]>([]); // Needed to display program name
  const [loadingData, setLoadingData] = useState(true); // Loading state for fetching initial data
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // formData will only contain editable fields: status and notes
  const [formData, setFormData] = useState<EnrollmentUpdate>({
    status: "active", // Default or initial status will be set from fetched enrollment
    notes: "",
    // clientId and programId are not included here as they are not editable
  });

  const [errors, setErrors] = useState({
    status: "", // Only status is required among editable fields
    // Add error states for other required fields for update if necessary
  });

  // Effect to fetch enrollment data, clients, and programs on component mount or ID change
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch the specific enrollment
        // Assume enrollmentApi.getEnrollment exists
        const fetchedEnrollment: Enrollment =
          await enrollmentApi.getEnrollmentById(id);
        setEnrollment(fetchedEnrollment);

        // Fetch all clients and programs concurrently for display in disabled selects
        const [clientsResponse, programsResponse] = await Promise.all([
          clientApi.getClients(1, 1000), // Limit 1000, assuming sufficient
          programApi.getPrograms(1, 1000), // Limit 1000, assuming sufficient
        ]);

        setClients(clientsResponse.results);
        setPrograms(programsResponse.results);

        // Pre-populate form with editable fields from fetched enrollment
        setFormData({
          status: fetchedEnrollment.status,
          notes: fetchedEnrollment.notes || "", // Handle null/undefined notes
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setEnrollment(null); // Indicate enrollment not found or error
        // Optionally clear clients/programs if fetching them failed
        setClients([]);
        setPrograms([]);
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]); // Re-run effect if ID changes

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // No error clearing needed for notes based on current validation
    },
    [],
  );

  const handleRadioChange = useCallback(
    (value: "active" | "completed" | "dropped") => {
      setFormData((prev) => ({
        ...prev,
        status: value,
      }));
      // Clear status error when user selects
      if (errors.status) {
        setErrors((prev) => ({ ...prev, status: "" }));
      }
    },
    [errors.status],
  ); // Depend on errors.status to correctly clear it

  const validateForm = () => {
    let isValid = true;
    // Only validate editable fields that are required. Status is required.
    const newErrors = { status: "" };

    if (!formData.status) {
      newErrors.status = "Status is required";
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
        description: "Please select a status for the enrollment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the actual API to update the enrollment
      // Assume enrollmentApi.updateEnrollment exists and takes enrollmentId and EnrollmentUpdate object
      const updatedEnrollment: Enrollment =
        await enrollmentApi.updateEnrollment(id, formData);

      // Find client and program names for toast message using the fetched lists
      const client = clients.find((c) => c.id === updatedEnrollment.clientId);
      const program = programs.find(
        (p) => p.id === updatedEnrollment.programId,
      );

      toast({
        title: "Enrollment Updated",
        description: `Enrollment for ${client?.fullName || "Client"} in ${program?.name || "Program"} updated.`,
        variant: "default",
      });

      // Redirect to the enrollment details page
      router.push(`/enrollments`);
    } catch (error: any) {
      // Use 'any' or a more specific error type if available
      console.error("Error updating enrollment:", error);
      toast({
        title: "Error",
        description: `Failed to update enrollment. ${error.message || "Please try again."}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Find the client and program for displaying names in the header and disabled selects
  const client = clients.find((c) => c.id === enrollment?.clientId);
  const program = programs.find((p) => p.id === enrollment?.programId);

  // Show loading skeleton while fetching initial data
  if (loadingData) {
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
              <Skeleton className="h-12 w-full" /> {/* Client Select */}
              <Skeleton className="h-12 w-full" /> {/* Program Select */}
            </div>
            <Skeleton className="h-12 w-full" /> {/* Status Radio */}
            <Skeleton className="h-24 w-full" /> {/* Notes Textarea */}
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show Enrollment Not Found message if fetching failed or enrollment is null
  if (!enrollment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Enrollment Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The enrollment you are looking for does not exist or an error
          occurred.
        </p>
        <Link href="/enrollments">
          <Button className="bg-teal-600 hover:bg-teal-700">
            Return to Enrollments List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href={`/enrollments/${id}`}>
            {" "}
            {/* Link back to enrollment details */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          {/* Display client and program names if found */}
          <h1 className="text-2xl font-bold text-teal-700">
            Edit Enrollment: {client?.fullName || "Unknown Client"} -{" "}
            {program?.name || "Unknown Program"}
          </h1>
        </div>
        {/* Cancel links back to enrollment details */}
        <Link href={`/enrollments/${id}`}>
          <Button variant="outline" className="border-blue-200 text-blue-600">
            Cancel
          </Button>
        </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">
            Enrollment Information
          </CardTitle>
          <CardDescription className="text-blue-600">
            Update the details for the enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="edit-enrollment-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-blue-700">
                  Client
                </Label>
                {/* Client Select - Display only, not editable */}
                <Select value={enrollment.clientId} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="programId" className="text-blue-700">
                  Program
                </Label>
                {/* Program Select - Display only, not editable */}
                <Select value={enrollment.programId} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700">
                Status <span className="text-red-500">*</span>{" "}
                {/* Status is editable */}
              </Label>
              <RadioGroup
                value={formData.status}
                onValueChange={handleRadioChange as (value: string) => void}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed">Completed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dropped" id="dropped" />
                  <Label htmlFor="dropped">Dropped</Label>
                </div>
              </RadioGroup>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}{" "}
              {/* Display status error */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-blue-700">
                Notes {/* Notes are editable */}
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes ?? ""} // Use ?? "" to handle potential null notes
                onChange={handleTextareaChange}
                placeholder="Any additional information about this enrollment"
                className="min-h-[100px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          {/* Cancel links back to enrollment details */}
          <Link href={`/enrollments/${id}`}>
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="edit-enrollment-form"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={
              isLoading ||
              loadingData ||
              !enrollment ||
              !clients.length ||
              !programs.length
            } // Disable if data is loading, submitting, or required data is missing
          >
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
