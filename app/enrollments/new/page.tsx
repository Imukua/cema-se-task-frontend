"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { mockClients, mockPrograms } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewEnrollmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    clientId: "",
    programId: "",
    status: "active",
    notes: "",
  })
  const [errors, setErrors] = useState({
    clientId: "",
    programId: "",
  })

  useEffect(() => {
    // Simulate API call to fetch clients and programs
    const fetchData = async () => {
      setLoadingData(true)
      try {
        // In a real app, these would be API calls
        setTimeout(() => {
          setClients(mockClients)
          setPrograms(mockPrograms)
          setLoadingData(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load clients and programs. Please try again.",
          variant: "destructive",
        })
        setLoadingData(false)
      }
    }

    fetchData()
  }, [toast])

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { clientId: "", programId: "" }

    if (!formData.clientId) {
      newErrors.clientId = "Please select a client"
      isValid = false
    }

    if (!formData.programId) {
      newErrors.programId = "Please select a program"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get client and program names for the toast message
      const client = clients.find((c) => c.id === formData.clientId)
      const program = programs.find((p) => p.id === formData.programId)

      // Mock successful enrollment creation
      toast({
        title: "Enrollment Created",
        description: `${client?.fullName} has been enrolled in ${program?.name}.`,
        variant: "default",
      })

      // Redirect to enrollments page
      router.push("/enrollments")
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the enrollment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-teal-700">Create New Enrollment</h1>
        <Link href="/enrollments">
          <Button variant="outline" className="border-blue-200 text-blue-600">
            Cancel
          </Button>
        </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">Enrollment Information</CardTitle>
          <CardDescription className="text-blue-600">Enroll a client in a health program</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <span className="ml-2 text-teal-600">Loading data...</span>
            </div>
          ) : (
            <form id="new-enrollment-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientId" className="text-blue-700">
                    Client <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.clientId} onValueChange={(value) => handleSelectChange("clientId", value)}>
                    <SelectTrigger className={errors.clientId ? "border-red-300" : ""}>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.clientId && <p className="text-sm text-red-500">{errors.clientId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programId" className="text-blue-700">
                    Program <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.programId} onValueChange={(value) => handleSelectChange("programId", value)}>
                    <SelectTrigger className={errors.programId ? "border-red-300" : ""}>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.programId && <p className="text-sm text-red-500">{errors.programId}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-blue-700">
                  Status <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={formData.status} onValueChange={handleRadioChange} className="flex space-x-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-blue-700">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleTextareaChange}
                  placeholder="Any additional information about this enrollment"
                  className="min-h-[100px]"
                />
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          <Link href="/enrollments">
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="new-enrollment-form"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading || loadingData}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Enrollment"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
