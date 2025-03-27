"use client";

import { CalendarClock, Flame } from "lucide-react";
import { EventCard } from "./event-card";

interface SpecialEventsViewProps {
  events: any[];
  onEventClick: (event: any) => void;
  searchQuery: string;
}

export function SpecialEventsView({
  events = [],
  onEventClick,
  searchQuery,
}: SpecialEventsViewProps) {
  const featuredEvent = events.find(
    (event) => event.featured || event.id === events[0]?.id
  );

  const filteredEvents = searchQuery
    ? events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  const nonFeaturedEvents = filteredEvents.filter(
    (event) => event.id !== featuredEvent?.id
  );
  const activeEvents = nonFeaturedEvents.filter(
    (event) =>
      new Date(event.startDate) <= new Date() &&
      new Date(event.endDate) >= new Date()
  );

  const upcomingEvents = nonFeaturedEvents.filter(
    (event) => new Date(event.startDate) > new Date()
  );

  return (
    <div className="space-y-8">
      {/* Featured Event */}
      {featuredEvent && !searchQuery && (
        <div className="bg-blue-800/50 rounded-xl overflow-hidden text-blue-200 mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/5 h-64 md:h-auto 2xl:h-80 bg-gray-200">
              <div className="absolute top-4 left-4">
                <span className="bg-purple-500 text-white flex gap-1 items-center px-3 py-1 rounded-full text-sm font-medium">
                  <span className="w-3 h-3">✨</span> Featured Special Event
                </span>
              </div>
              {new Date(featuredEvent.startDate) <= new Date() && (
                <div className="absolute bottom-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
                    Active Now
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt=""
                  className="w-20 h-20"
                />
              </div>
            </div>

            <div className="p-6 flex-1">
              <div className="flex flex-col h-full">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {featuredEvent.title}
                </h2>
                <p className="text-blue-100 my-3">
                  {featuredEvent.description}
                </p>

                <div className="mt-auto flex flex-col xl:flex-row gap-y-3 items-start xl:items-center justify-between">
                  <div className="flex items-center text-sm text-blue-200">
                    <span className="mr-2">🗓️</span>
                    <span>
                      {new Date(featuredEvent.startDate).toLocaleDateString()} -{" "}
                      {new Date(featuredEvent.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => onEventClick(featuredEvent)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Special Events */}
      {activeEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-blue-300 mr-2">
              <Flame className="w-6" />
            </span>
            Active Special Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Special Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-blue-300 mr-2">
              <CalendarClock className="w-6" />
            </span>
            Upcoming Special Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Special Events */}
      {filteredEvents.filter((event) => new Date(event.endDate) < new Date())
        .length > 0 && (
        <div className="mt-10 pt-6 border-t border-blue-700/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center opacity-70">
            <span className="text-blue-300 mr-2">📜</span>
            Past Special Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60 grayscale-[30%]">
            {filteredEvents
              .filter((event) => new Date(event.endDate) < new Date())
              .slice(0, 6)
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => {}}
                  isPast={true}
                />
              ))}
          </div>

          {filteredEvents.filter(
            (event) => new Date(event.endDate) < new Date()
          ).length > 6 && (
            <div className="text-center mt-4">
              <span className="text-blue-300 text-sm opacity-70">
                +{" "}
                {filteredEvents.filter(
                  (event) => new Date(event.endDate) < new Date()
                ).length - 6}{" "}
                more past events
              </span>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-blue-800/30 rounded-lg">
          <p className="text-lg text-blue-200 mb-2">No special events found</p>
          <p className="text-sm text-blue-300">
            Check back later for new special events
          </p>
        </div>
      )}
    </div>
  );
}
