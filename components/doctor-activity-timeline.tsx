"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, LogIn, User, ClipboardList, FileEdit } from "lucide-react"

interface DoctorActivityTimelineProps {
  activities: {
    id: string
    type: string
    date: string
    title: string
    clientName?: string
    programName?: string
  }[]
}

export function DoctorActivityTimeline({ activities }: DoctorActivityTimelineProps) {
  // Sort by date (newest first)
  const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4 text-blue-500" />
      case "client":
        return <User className="h-4 w-4 text-teal-500" />
      case "enrollment":
        return <ClipboardList className="h-4 w-4 text-green-500" />
      case "update":
        return <FileEdit className="h-4 w-4 text-amber-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "login":
        return <Badge className="bg-blue-100 text-blue-700">Login</Badge>
      case "client":
        return <Badge className="bg-teal-100 text-teal-700">New Client</Badge>
      case "enrollment":
        return <Badge className="bg-green-100 text-green-700">Enrollment</Badge>
      case "update":
        return <Badge className="bg-amber-100 text-amber-700">Update</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Activity</Badge>
    }
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-100">
      {sortedActivities.length > 0 ? (
        sortedActivities.map((activity) => (
          <div key={activity.id} className="relative pl-10">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
              {getActivityIcon(activity.type)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">{activity.title}</p>
                {getActivityBadge(activity.type)}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                </span>
              </div>
              {activity.clientName && activity.programName && (
                <p className="text-xs text-gray-600 mt-1">
                  Program: <span className="font-medium">{activity.programName}</span>
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">No activity found for this doctor.</div>
      )}
    </div>
  )
}
