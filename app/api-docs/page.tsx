"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState("auth");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2 text-teal-700">
        API Documentation
      </h1>
      <p className="text-muted-foreground mb-6">
        Complete reference for the Health Information System API v1
      </p>

      <Tabs
        defaultValue="auth"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-8 bg-teal-50 p-1 border border-teal-100">
          <TabsTrigger
            value="auth"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Authentication
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Clients
          </TabsTrigger>
          <TabsTrigger
            value="programs"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Programs
          </TabsTrigger>
          <TabsTrigger
            value="enrollments"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Enrollments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          <ApiSection
            title="Authentication"
            description="Endpoints for user registration, login, and token refresh."
            endpoints={[
              {
                method: "POST",
                path: "/v1/auth/register",
                description: "Register a new user",
                requestBody: `{
  "name": "string",
  "email": "string",
  "password": "string"
}`,
                responseBody: `{
  "user": {
    "id": "string (uuid)",
    "name": "string",
    "email": "string",
    "role": "string (ADMIN or USER)",
    "createdAt": "date",
    "updatedAt": "date",
    "password": "string"
  },
  "tokens": {
    "access": {
      "token": "string"
    },
    "refresh": {
      "token": "string"
    }
  }
}`,
              },
              {
                method: "POST",
                path: "/v1/auth/login",
                description: "Login with email and password",
                requestBody: `{
  "email": "string",
  "password": "string"
}`,
                responseBody: `{
  "user": {
    "id": "string (uuid)",
    "name": "string",
    "email": "string",
    "role": "string (ADMIN or USER)",
    "createdAt": "date",
    "updatedAt": "date",
    "password": "string"
  },
  "tokens": {
    "access": {
      "token": "string"
    },
    "refresh": {
      "token": "string"
    }
  }
}`,
              },
              {
                method: "POST",
                path: "/v1/auth/refresh",
                description: "Refresh access token",
                requestBody: `{
  "refreshToken": "string"
}`,
                responseBody: `{
  "tokens": {
    "access": {
      "token": "string"
    },
    "refresh": {
      "token": "string"
    }
  }
}`,
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="users">
          <ApiSection
            title="Users"
            description="Endpoints for managing users."
            endpoints={[
              {
                method: "GET",
                path: "/v1/users",
                description: "Get all users with pagination",
                requestBody:
                  "None (uses query parameters for pagination, search, and sort)",
                responseBody: `{
  "results": [
    {
      "id": "string (uuid)",
      "name": "string",
      "email": "string",
      "role": "string (ADMIN or USER)",
      "createdAt": "date",
      "updatedAt": "date",
      "password": "string"
    }
  ],
  "totalResults": "number",
  "limit": "number",
  "page": "number",
  "totalPages": "number",
  "hasNextPage": "boolean"
}`,
              },
              {
                method: "GET",
                path: "/v1/users/:id",
                description: "Get a specific user by ID",
                requestBody: "None",
                responseBody: `{
  "id": "string (uuid)",
  "name": "string",
  "email": "string",
  "role": "string (ADMIN or USER)",
  "createdAt": "date",
  "updatedAt": "date",
  "password": "string"
}`,
              },
              {
                method: "PATCH",
                path: "/v1/users/:id",
                description: "Update a user",
                requestBody: `{
  "name": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)"
}`,
                responseBody: `{
  "id": "string (uuid)",
  "name": "string",
  "email": "string",
  "role": "string (ADMIN or USER)",
  "createdAt": "date",
  "updatedAt": "date",
  "password": "string"
}`,
              },
              {
                method: "DELETE",
                path: "/v1/users/:id",
                description: "Delete a user",
                requestBody: "None",
                responseBody: "None (HTTP Status 204 No Content)",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="clients">
          <ApiSection
            title="Clients"
            description="Endpoints for managing clients."
            endpoints={[
              {
                method: "POST",
                path: "/v1/clients",
                description: "Create a new client",
                requestBody: `{
  "fullName": "string",
  "dob": "date",
  "gender": "string",
  "contact": "string",
  "notes": "string (nullable)"
}`,
                responseBody: `{
  "id": "string (uuid)",
  "fullName": "string",
  "dob": "date",
  "gender": "string",
  "contact": "string",
  "notes": "string (nullable)",
  "createdAt": "date",
  "updatedAt": "date",
  "userId": "string (uuid)"
}`,
              },
              {
                method: "GET",
                path: "/v1/clients",
                description: "Get all clients with pagination",
                requestBody:
                  "None (uses query parameters for pagination, search, filter, and sort)",
                responseBody: `{
  "results": [
    {
      "id": "string (uuid)",
      "fullName": "string",
      "dob": "date",
      "gender": "string",
      "contact": "string",
      "notes": "string (nullable)",
      "createdAt": "date",
      "updatedAt": "date",
      "userId": "string (uuid)"
    }
  ],
  "totalResults": "number",
  "limit": "number",
  "page": "number",
  "totalPages": "number",
  "hasNextPage": "boolean"
}`,
              },
              {
                method: "GET",
                path: "/v1/clients/:id",
                description: "Get a specific client by ID",
                requestBody: "None",
                responseBody: `{
  "id": "string (uuid)",
  "fullName": "string",
  "dob": "date",
  "gender": "string",
  "contact": "string",
  "notes": "string (nullable)",
  "createdAt": "date",
  "updatedAt": "date",
  "userId": "string (uuid)",
  "programs": [
    {
      "id": "string (uuid)",
      "clientId": "string (uuid)",
      "programId": "string (uuid)",
      "enrolledAt": "date",
      "status": "string (active, completed, or dropped)",
      "notes": "string (nullable)",
      "healthProgram": {
        "id": "string (uuid)",
        "name": "string",
        "description": "string (nullable)",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }
  ]
}`,
              },
              {
                method: "PATCH",
                path: "/v1/clients/:id",
                description: "Update a client",
                requestBody: `{
  "fullName": "string (optional)",
  "dob": "date (optional)",
  "gender": "string (optional)",
  "contact": "string (optional)",
  "notes": "string (nullable, optional)"
}`,
                responseBody: `{
  "id": "string (uuid)",
  "fullName": "string",
  "dob": "date",
  "gender": "string",
  "contact": "string",
  "notes": "string (nullable)",
  "createdAt": "date",
  "updatedAt": "date",
  "userId": "string (uuid)"
}`,
              },
              {
                method: "DELETE",
                path: "/v1/clients/:id",
                description: "Delete a client",
                requestBody: "None",
                responseBody: "None (HTTP Status 204 No Content)",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="programs">
          <ApiSection
            title="Health Programs"
            description="Endpoints for managing health programs."
            endpoints={[
              {
                method: "POST",
                path: "/v1/programs",
                description: "Create a new health program",
                requestBody: `{
  "name": "string",
  "description": "string (nullable)"
}`,
                responseBody: `{
  "id": "string (uuid)",
  "name": "string",
  "description": "string (nullable)",
  "createdAt": "date",
  "updatedAt": "date"
}`,
              },
              {
                method: "GET",
                path: "/v1/programs",
                description: "Get all health programs with pagination",
                requestBody:
                  "None (uses query parameters for pagination, search, and sort)",
                responseBody: `{
  "results": [
    {
      "id": "string (uuid)",
      "name": "string",
      "description": "string (nullable)",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "totalResults": "number",
  "limit": "number",
  "page": "number",
  "totalPages": "number",
  "hasNextPage": "boolean"
}`,
              },
              {
                method: "GET",
                path: "/v1/programs/:id",
                description: "Get a specific health program by ID",
                requestBody: "None",
                responseBody: `{
  "id": "string (uuid)",
  "name": "string",
  "description": "string (nullable)",
  "createdAt": "date",
  "updatedAt": "date"
}`,
              },
              {
                method: "PATCH",
                path: "/v1/programs/:id",
                description: "Update a health program",
                requestBody: `{
  "name": "string (optional)",
  "description": "string (nullable, optional)"
}`,
                responseBody: `{
  "id": "string (uuid)",
  "name": "string",
  "description": "string (nullable)",
  "createdAt": "date",
  "updatedAt": "date"
}`,
              },
              {
                method: "DELETE",
                path: "/v1/programs/:id",
                description: "Delete a health program",
                requestBody: "None",
                responseBody: "None (HTTP Status 204 No Content)",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="enrollments">
          <ApiSection
            title="Enrollments"
            description="Endpoints for managing client enrollments in health programs."
            endpoints={[
              {
                method: "POST",
                path: "/v1/enrollments",
                description: "Create a new enrollment",
                requestBody: `{
  "clientId": "string (uuid)",
  "programId": "string (uuid)",
  "status": "string (active, completed, or dropped - optional, defaults to active)",
  "notes": "string (nullable, optional)"
}`,
                responseBody: `{
  "id": "string (uuid)",
  "clientId": "string (uuid)",
  "programId": "string (uuid)",
  "enrolledAt": "date",
  "status": "string (active, completed, or dropped)",
  "notes": "string (nullable)"
}`,
              },
              {
                method: "GET",
                path: "/v1/enrollments",
                description: "Get all enrollments with pagination",
                requestBody:
                  "None (uses query parameters for pagination, filter, and sort)",
                responseBody: `{
  "results": [
    {
      "id": "string (uuid)",
      "clientId": "string (uuid)",
      "programId": "string (uuid)",
      "enrolledAt": "date",
      "status": "string (active, completed, or dropped)",
      "notes": "string (nullable)",
      "client": {
        "id": "string (uuid)",
        "fullName": "string",
        "dob": "date",
        "gender": "string",
        "contact": "string",
        "notes": "string (nullable)",
        "createdAt": "date",
        "updatedAt": "date",
        "userId": "string (uuid)"
      },
      "healthProgram": {
        "id": "string (uuid)",
        "name": "string",
        "description": "string (nullable)",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }
  ],
  "totalResults": "number",
  "limit": "number",
  "page": "number",
  "totalPages": "number",
  "hasNextPage": "boolean"
}`,
              },
              {
                method: "GET",
                path: "/v1/enrollments/:enrollmentId",
                description: "Get a specific enrollment by ID",
                requestBody: "None",
                responseBody: `{
  "id": "string (uuid)",
  "clientId": "string (uuid)",
  "programId": "string (uuid)",
  "enrolledAt": "date",
  "status": "string (active, completed, or dropped)",
  "notes": "string (nullable)",
  "client": {
    "id": "string (uuid)",
    "fullName": "string",
    "dob": "date",
    "gender": "string",
    "contact": "string",
    "notes": "string (nullable)",
    "createdAt": "date",
    "updatedAt": "date",
    "userId": "string (uuid)"
  },
  "healthProgram": {
    "id": "string (uuid)",
    "name": "string",
    "description": "string (nullable)",
    "createdAt": "date",
    "updatedAt": "date"
  }
}`,
              },
              {
                method: "GET",
                path: "/v1/enrollments/client/:clientId",
                description: "Get all enrollments for a specific client",
                requestBody:
                  "None (uses query parameters for pagination and sort)",
                responseBody: `{
  "results": [
    {
      "id": "string (uuid)",
      "clientId": "string (uuid)",
      "programId": "string (uuid)",
      "enrolledAt": "date",
      "status": "string (active, completed, or dropped)",
      "notes": "string (nullable)",
      "client": {
        "id": "string (uuid)",
        "fullName": "string",
        "dob": "date",
        "gender": "string",
        "contact": "string",
        "notes": "string (nullable)",
        "createdAt": "date",
        "updatedAt": "date",
        "userId": "string (uuid)"
      },
      "healthProgram": {
        "id": "string (uuid)",
        "name": "string",
        "description": "string (nullable)",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }
  ],
  "totalResults": "number",
  "limit": "number",
  "page": "number",
  "totalPages": "number",
  "hasNextPage": "boolean"
}`,
              },
              {
                method: "PATCH",
                path: "/v1/enrollments/:enrollmentId",
                description: "Update an enrollment",
                requestBody: `{
  "status": "string (active, completed, or dropped - optional)",
  "notes": "string (nullable, optional)"
}`,
                responseBody: `{
  "id": "string (uuid)",
  "clientId": "string (uuid)",
  "programId": "string (uuid)",
  "enrolledAt": "date",
  "status": "string (active, completed, or dropped)",
  "notes": "string (nullable)"
}`,
              },
              {
                method: "DELETE",
                path: "/v1/enrollments/:enrollmentId",
                description: "Delete an enrollment",
                requestBody: "None",
                responseBody: "None (HTTP Status 204 No Content)",
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ApiSectionProps {
  title: string;
  description: string;
  endpoints: {
    method: string;
    path: string;
    description: string;
    requestBody: string;
    responseBody: string;
  }[];
}

function ApiSection({ title, description, endpoints }: ApiSectionProps) {
  return (
    <div>
      <Card className="mb-8 border-teal-100 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 border-b border-teal-100">
          <CardTitle className="text-teal-700">{title}</CardTitle>
          <CardDescription className="text-blue-600">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>

      {endpoints.map((endpoint, index) => (
        <Card
          key={index}
          className="mb-6 border-teal-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-3 bg-gradient-to-r from-teal-50 to-blue-50 border-b border-teal-100">
            <div className="flex items-center gap-3">
              <Badge variant={getBadgeVariant(endpoint.method)}>
                {endpoint.method}
              </Badge>
              <code className="text-sm font-mono bg-white/70 px-2 py-1 rounded border border-teal-100">
                {endpoint.path}
              </code>
            </div>
            <CardDescription className="mt-2 text-blue-600">
              {endpoint.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="request" className="border-teal-100">
                <AccordionTrigger className="text-teal-700 hover:text-teal-800 hover:no-underline py-3">
                  Request Body
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[300px] rounded-md border border-teal-100 bg-teal-50/50">
                    <pre className="text-sm font-mono p-4 text-blue-800">
                      {endpoint.requestBody}
                    </pre>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="response" className="border-teal-100">
                <AccordionTrigger className="text-teal-700 hover:text-teal-800 hover:no-underline py-3">
                  Response Body
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[300px] rounded-md border border-teal-100 bg-teal-50/50">
                    <pre className="text-sm font-mono p-4 text-blue-800">
                      {endpoint.responseBody}
                    </pre>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getBadgeVariant(method: string) {
  switch (method) {
    case "GET":
      return "default";
    case "POST":
      return "secondary";
    case "PATCH":
      return "outline";
    case "DELETE":
      return "destructive";
    default:
      return "default";
  }
}
