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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function NewClientPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Male",
    contact: "",
    notes: "",
  })
  const [errors, setErrors] = useState({
    fullName: "",
    dob: "",
    contact: "",
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

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { fullName: "", dob: "", contact: "" }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
      isValid = false
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required"
      isValid = false
    } else {
      const dobDate = new Date(formData.dob)
      const today = new Date()
      if (dobDate > today) {
        newErrors.dob = "Date of birth cannot be in the future"
        isValid = false
      }
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact information is required"
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

      // Mock successful client creation
      toast({
        title: "Client Created",
        description: `${formData.fullName} has been successfully added.`,
        variant: "default",
      })

      // Redirect to clients page
      router.push("/clients")
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information about the client"
                className="min-h-[100px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          <Link href="/clients">
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="new-client-form" className="bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
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
  )
}
