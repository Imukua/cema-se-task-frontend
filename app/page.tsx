import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-teal-700">
          Health Information System
        </h1>
        <p className="text-xl text-blue-600 max-w-md">
          Manage clients, programs, and enrollments in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card className="bg-white/80 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-teal-700">Clients</h2>
            <p className="text-blue-600">
              Manage client profiles and information
            </p>
            <Link href="/clients" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                View Clients
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-teal-700">Programs</h2>
            <p className="text-blue-600">View and manage health programs</p>
            <Link href="/programs" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Programs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-teal-700">Enrollments</h2>
            <p className="text-blue-600">Manage program enrollments</p>
            <Link href="/enrollments" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                View Enrollments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4 mt-8">
        <Link href="/login">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-teal-600 hover:bg-teal-700">Register</Button>
        </Link>
      </div>
    </div>
  );
}
