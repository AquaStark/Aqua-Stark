"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  events: any[];
  onEventClick: (event: any) => void;
}

export function CalendarView({ events = [], onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Get month name and year
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Create calendar days array
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Get events for the current month
  const monthEvents = (events || []).filter((event) => {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);

    // Check if event is in the current month
    return (
      (eventStartDate.getMonth() === currentDate.getMonth() &&
        eventStartDate.getFullYear() === currentDate.getFullYear()) ||
      (eventEndDate.getMonth() === currentDate.getMonth() &&
        eventEndDate.getFullYear() === currentDate.getFullYear()) ||
      (eventStartDate <
        new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) &&
        eventEndDate >
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
    );
  });

  // Group events by day
  const eventsByDay: Record<number, any[]> = {};

  monthEvents.forEach((event) => {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);

    // Calculate the range of days this event spans in the current month
    const startDay =
      eventStartDate.getMonth() === currentDate.getMonth()
        ? eventStartDate.getDate()
        : 1;

    const endDay =
      eventEndDate.getMonth() === currentDate.getMonth()
        ? eventEndDate.getDate()
        : daysInMonth;

    // Add event to each day it spans
    for (let day = startDay; day <= endDay; day++) {
      if (!eventsByDay[day]) {
        eventsByDay[day] = [];
      }
      eventsByDay[day].push(event);
    }
  });

  return (
    <div className="bg-blue-700 rounded-xl p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-blue-700/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold">
          {monthName} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-blue-700/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center py-2 text-blue-300 font-medium">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[70px] 2xl:min-h-[100px] p-1 rounded ${
              day ? "bg-blue-800/40" : ""
            }`}
          >
            {day && (
              <>
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-sm font-medium">{day}</span>
                  {eventsByDay[day] && (
                    <span className="text-xs bg-blue-600 rounded-full px-1.5 py-0.5">
                      {eventsByDay[day].length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {eventsByDay[day]?.map((event, eventIndex) => {
                    // Determine event color based on category
                    let bgColor;
                    switch (event.category) {
                      case "special":
                        bgColor = "bg-purple-500";
                        break;
                      case "tournament":
                        bgColor = "bg-yellow-500";
                        break;
                      case "offer":
                        bgColor = "bg-blue-400";
                        break;
                      case "season":
                        bgColor = "bg-green-500";
                        break;
                      default:
                        bgColor = "bg-gray-500";
                    }

                    return (
                      <div
                        key={`${event.id}-${eventIndex}`}
                        className={`${bgColor} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-80`}
                        onClick={() => onEventClick(event)}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
