"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2, KeyRound, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import type { UserLogin } from "@/lib/types/api";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState<UserLogin>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await login(formData);

    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to the Health Information System.",
        variant: "default",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: error || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const useTestCredentials = () => {
    setFormData({
      email: "testdoctor@test.com",
      password: "testpass",
    });
    // Clear any existing errors
    setFormErrors({ email: "", password: "" });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-blue-50 to-teal-50 py-6 px-4">
      <Card className="w-full max-w-md border-teal-100 shadow-md bg-white/95">
        <CardHeader className="pb-2 space-y-1">
          <div className="flex items-center justify-center mb-1">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-center text-teal-700">
            Health Information System
          </CardTitle>
          <CardDescription className="text-center text-blue-600">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-3 pb-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-blue-700 text-sm font-medium"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 h-9 ${formErrors.email ? "border-red-300" : ""}`}
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-blue-700 text-sm font-medium"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 h-9 ${formErrors.password ? "border-red-300" : ""}`}
                />
              </div>
              {formErrors.password && (
                <p className="text-xs text-red-500">{formErrors.password}</p>
              )}
            </div>

            <div className="pt-1 flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 h-9"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="border-teal-200 text-teal-600 hover:bg-teal-50 h-9"
                onClick={useTestCredentials}
                disabled={isLoading}
                title="Use test credentials: testdoctor@test.com / testpass"
              >
                Test Login
              </Button>
            </div>
          </form>

          <div className="mt-3 text-center text-xs text-gray-500 bg-blue-50 rounded p-2">
            <span className="font-medium">Test Account:</span>{" "}
            testdoctor@test.com / testpass
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-2 pb-3">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
