"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Activity, User, Clock } from "lucide-react";

interface ClientEnrollmentTimelineProps {
  enrollments: any[];
  clientCreatedAt: string;
}

export function ClientEnrollmentTimeline({
  enrollments,
  clientCreatedAt,
}: ClientEnrollmentTimelineProps) {
  // Combine client creation and enrollments into a single timeline
  const timelineEvents = [
    {
      id: "client-created",
      type: "creation",
      date: clientCreatedAt,
      title: "Client Profile Created",
    },
    ...enrollments.map((enrollment) => ({
      id: enrollment.id,
      type: "enrollment",
      status: enrollment.status,
      date: enrollment.enrolledAt,
      title: `Enrolled in ${enrollment.program.name}`,
      programName: enrollment.program.name,
      notes: enrollment.notes,
    })),
  ];

  // Sort by date (newest first)
  const sortedEvents = timelineEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "dropped":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-100">
      {sortedEvents.length > 0 ? (
        sortedEvents.map((event, index) => (
          <div key={event.id} className="relative pl-10">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
              {event.type === "creation" ? (
                <User className="h-4 w-4 text-blue-500" />
              ) : (
                getStatusIcon(event.status)
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">
                  {event.title}
                </p>
                {event.type === "enrollment" && (
                  <Badge
                    className={
                      event.status === "active"
                        ? "bg-green-100 text-green-700"
                        : event.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }
                  >
                    {event.status}
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              {event.notes && (
                <p className="text-xs text-gray-600 italic mt-1">
                  "{event.notes}"
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No timeline events found for this client.
        </div>
      )}
    </div>
  );
}
