"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function NewProgramPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [errors, setErrors] = useState({
    name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { name: "" }

    if (!formData.name.trim()) {
      newErrors.name = "Program name is required"
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

      // Mock successful program creation
      toast({
        title: "Program Created",
        description: `${formData.name} has been successfully added.`,
        variant: "default",
      })

      // Redirect to programs page
      router.push("/programs")
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the program. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-teal-700">Add New Program</h1>
        <Link href="/programs">
          <Button variant="outline" className="border-blue-200 text-blue-600">
            Cancel
          </Button>
        </Link>
      </div>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">Program Information</CardTitle>
          <CardDescription className="text-blue-600">Enter the details for the new health program</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="new-program-form" onSubmit={handleSubmit} className="space-y-6">
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
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the program"
                className="min-h-[150px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          <Link href="/programs">
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="new-program-form" className="bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Program"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
