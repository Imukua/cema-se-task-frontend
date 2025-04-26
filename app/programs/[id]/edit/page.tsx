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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Import API service
import { programApi } from "@/lib/api/programApi";
// Assume necessary types like HealthProgram and HealthProgramUpdate exist
import { HealthProgram, HealthProgramUpdate } from "@/lib/types/api";

export default function EditProgramPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams() as { id: string }; // Get program ID from URL

  const [program, setProgram] = useState<HealthProgram | null>(null);
  const [loadingData, setLoadingData] = useState(true); // Loading state for fetching initial data
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  // Assuming HealthProgramUpdate includes these fields and they are optional
  const [formData, setFormData] = useState<HealthProgramUpdate>({
    name: "",
    description: "",
    // Add any other updatable fields for HealthProgramUpdate based on your API
  });

  const [errors, setErrors] = useState({
    name: "",
    // Add error states for other required fields if necessary
  });

  // Effect to fetch program data on component mount or ID change
  useEffect(() => {
    const fetchProgram = async () => {
      setLoadingData(true);
      try {
        const fetchedProgram: HealthProgram = await programApi.getProgram(id);
        setProgram(fetchedProgram);
        // Pre-populate form with fetched data
        setFormData({
          name: fetchedProgram.name,
          description: fetchedProgram.description || "", // Handle null/undefined description
        });
      } catch (error) {
        console.error("Error fetching program:", error);
        setProgram(null); // Indicate program not found
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchProgram();
    }
  }, [id]); // Re-run effect if ID changes

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    },
    [errors],
  ); // Depend on errors to correctly clear them

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "" }; // Update with all required fields for update

    // Assuming name is still required for update
    if (!formData.name?.trim()) {
      // Use optional chaining as HealthProgramUpdate might have optional fields
      newErrors.name = "Program name is required";
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
      // Call the actual API to update the program
      // Assuming programApi.updateProgram takes programId and HealthProgramUpdate object
      const updatedProgram: HealthProgram = await programApi.updateProgram(
        id,
        formData,
      );

      toast({
        title: "Program Updated",
        description: `${updatedProgram.name} has been successfully updated.`,
        variant: "default",
      });

      // Redirect to the program details page
      router.push(`/programs/${id}`);
    } catch (error: any) {
      // Use 'any' or a more specific error type if available
      console.error("Error updating program:", error);
      toast({
        title: "Error",
        description: `Failed to update program. ${error.message || "Please try again."}`,
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
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show Program Not Found message if fetching failed or program is null
  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Program Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The program you are looking for does not exist or an error occurred.
        </p>
        <Link href="/programs">
          <Button className="bg-teal-600 hover:bg-teal-700">
            Return to Programs List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href={`/programs/${id}`}>
            {" "}
            {/* Link back to program details */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-teal-700">
            Edit Program: {program.name}
          </h1>
        </div>
        <Link href="/programs">
          {" "}
          {/* Cancel links back to list */}
          <Button variant="outline" className="border-blue-200 text-blue-600">
            Cancel
          </Button>
        </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">
            Program Information
          </CardTitle>
          <CardDescription className="text-blue-600">
            Update the details for the health program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="edit-program-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-700">
                Program Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., HIV Prevention"
                className={errors.name ? "border-red-300" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""} // Ensure value is never null for textarea
                onChange={handleChange}
                placeholder="Provide a detailed description of the program"
                className="min-h-[150px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          <Link href={`/programs/${id}`}>
            {" "}
            {/* Cancel links back to program details */}
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="edit-program-form"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading || loadingData}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
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
