"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"
import type { UserCreate } from "@/lib/types/api"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { register, isLoading, error } = useAuth()

  const [formData, setFormData] = useState<UserCreate & { confirmPassword: string }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    if (!formData.name) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setFormErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = formData

    const success = await register(userData)

    if (success) {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You are now logged in.",
        variant: "default",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      toast({
        title: "Registration Error",
        description: error || "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md bg-white/90 border-teal-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-teal-700">Create an Account</CardTitle>
          <CardDescription className="text-center text-blue-600">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? "border-red-300" : ""}
              />
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "border-red-300" : ""}
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "border-red-300" : ""}
              />
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? "border-red-300" : ""}
              />
              {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
