"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"

export default function EditProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    // Simulate API call
    const fetchUserData = async () => {
      setLoadingUser(true)
      try {
        // In a real app, this would be an API call to get the current user
        setTimeout(() => {
          // Use the first user from mock data for demo purposes
          const user = mockUsers[0]
          setFormData({
            name: user.name,
            email: user.email,
          })
          setLoadingUser(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoadingUser(false)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const newErrors = { name: "", email: "" }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
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

      // Mock successful profile update
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      })

      // Redirect to profile page
      router.push("/profile")
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-2 text-teal-600">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-teal-100 text-teal-700 text-xl">
              <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-teal-700">Edit Profile</CardTitle>
              <CardDescription className="text-blue-600">Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
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
                  className={errors.email ? "border-red-300" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-blue-700">
                Current Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                placeholder="Enter your current password to confirm changes"
              />
              <p className="text-xs text-gray-500">Required to save changes to your profile</p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 border-t border-teal-100 pt-4">
          <Link href="/profile">
            <Button variant="outline" className="border-blue-200 text-blue-600">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="edit-profile-form" className="bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-white/80 border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-teal-700">Change Password</CardTitle>
          <CardDescription className="text-blue-600">Update your password to maintain account security</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-blue-700">
                  New Password
                </Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-blue-700">
                  Confirm New Password
                </Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-teal-100 pt-4">
          <Button className="bg-blue-600 hover:bg-blue-700">Change Password</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
