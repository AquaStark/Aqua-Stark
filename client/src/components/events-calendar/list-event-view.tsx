"use client";

import {
  Bookmark,
  Calendar,
  CalendarClock,
  Clock,
  Flame,
  Gift,
  Leaf,
  MapPin,
  Sparkles,
  Tag,
  Trophy,
  Users,
} from "lucide-react";

// Moved utility functions directly into component
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeLeft(dateString: string): string {
  const targetDate = new Date(dateString);
  const now = new Date();

  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else {
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    }
  }
}

interface ListEventViewProps {
  events: any[];
  onEventClick: (event: any) => void;
  searchQuery: string;
}

export function ListEventView({
  events = [],
  onEventClick,
  searchQuery,
}: ListEventViewProps) {
  const featuredEvent = events.find((event) => event.featured);

  const filteredEvents = searchQuery
    ? events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  const activeEvents = filteredEvents.filter(
    (event) =>
      new Date(event.startDate) <= new Date() &&
      new Date(event.endDate) >= new Date() &&
      !event.featured
  );

  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.startDate) > new Date()
  );

  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.endDate) < new Date()
  );

  return (
    <div className="space-y-8">
      {/* Featured Event */}
      {featuredEvent && !searchQuery && (
        <div className="bg-blue-800/50 rounded-xl overflow-hidden text-blue-200">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gray-200">
              <div className="absolute top-4 left-4">
                <span className="bg-purple-500 text-white flex gap-1 items-center px-3 py-1 rounded-full text-sm font-medium">
                  <Sparkles className="w-3 h-3" /> Featured Event
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
                  <Flame className="w-3 h-3" />
                  Active Now
                </span>
              </div>
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
                <div>
                  <div className="flex justify-between items-start md:items-center">
                    <div className="flex flex-col">
                      <h2 className="text-xl md:text-2xl font-bold text-white inline">
                        {featuredEvent.title}
                        {featuredEvent.category === "special" && (
                          <span className="ml-2 text-purple-200">
                            <Sparkles />
                          </span>
                        )}
                      </h2>
                      <div className="flex items-center text-blue-200 mt-1 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {formatDate(featuredEvent.startDate)} -{" "}
                          {formatDate(featuredEvent.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4 min-w-24 md:min-w-fit">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs md:text-sm text-blue-200">
                          Event Progress
                        </span>
                      </div>
                      <div className="flex items-center gap-x-1">
                        <div className="w-full bg-blue-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${featuredEvent.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-blue-100">
                          {featuredEvent.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-blue-100 mb-4">
                    {featuredEvent.description}
                  </p>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-blue-200 mb-2">
                      Rewards:
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {featuredEvent.rewards.map(
                        (reward: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-0.5 text-sm"
                          >
                            <Gift className="w-3 h-3 mr-1" />
                            <span className="text-blue-100">{reward}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col xl:flex-row gap-y-3 items-start xl:items-center justify-between">
                  <div className="flex items-center text-sm text-blue-200">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{featuredEvent.participants} participants</span>
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{featuredEvent.location}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md text-sm">
                      Set Reminder
                    </button>
                    <button
                      className={`${
                        featuredEvent.isRegistered
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white px-3 py-1 rounded-md text-sm`}
                    >
                      {featuredEvent.isRegistered ? "Registered" : "Register"}
                    </button>
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
        </div>
      )}

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-blue-300 mr-2">
              <Flame />
            </span>
            Active Events
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

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-blue-300 mr-2">
              <CalendarClock />
            </span>
            Upcoming Events
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

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="mt-10 pt-6 border-t border-blue-700/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center opacity-70">
            <span className="text-blue-300 mr-2">📜</span>
            Past Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60 grayscale-[30%]">
            {pastEvents.slice(0, 6).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => {}}
                isPast={true}
              />
            ))}
          </div>

          {pastEvents.length > 6 && (
            <div className="text-center mt-4">
              <span className="text-blue-300 text-sm opacity-70">
                + {pastEvents.length - 6} more past events
              </span>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-blue-800/30 rounded-lg">
          <p className="text-lg text-blue-200 mb-2">No events found</p>
          <p className="text-sm text-blue-300">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
}

interface EventCardProps {
  event: any;
  onClick: () => void;
  isPast?: boolean;
}

function EventCard({ event, onClick, isPast = false }: EventCardProps) {
  const getCategoryTag = (category: string) => {
    switch (category) {
      case "special":
        return {
          bg: "bg-purple-500",
          text: "Special",
          icon: <Sparkles className="w-4 h-4" />,
        };
      case "tournament":
        return {
          bg: "bg-yellow-500",
          text: "Tournament",
          icon: <Trophy className="w-4 h-4" />,
        };
      case "offer":
        return {
          bg: "bg-blue-400",
          text: "Offer",
          icon: <Tag className="w-4 h-4" />,
        };
      case "season":
        return {
          bg: "bg-green-500",
          text: "Season",
          icon: <Leaf className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "Event",
          icon: <Calendar className="w-4 h-4" />,
        };
    }
  };

  const tag = getCategoryTag(event.category);

  return (
    <div
      className={`bg-blue-800/40 border border-blue-700/50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        !isPast ? "hover:transform hover:scale-[1.02]" : ""
      }`}
      onClick={isPast ? undefined : onClick}
    >
      <div className="relative h-40 bg-gray-200">
        <div className="absolute top-2 right-2">
          <span
            className={`${tag.bg} text-white px-2 py-0.5 flex gap-x-1 rounded-full text-xs font-medium`}
          >
            {tag.icon} {tag.text}
          </span>
        </div>

        {!isPast && new Date(event.startDate) <= new Date() && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
              Active
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/placeholder.svg?height=160&width=160"
            alt=""
            className="w-16 h-16"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full pl-4 pt-0.5 bg-gradient-to-b from-gray-200 via-gray-500 to-gray-600">
          <h3 className="font-bold text-white mb-1 text-sm">{event.title}</h3>
          {isPast ? (
            <div className="text-xs text-blue-300 mb-2">
              Ended on {formatDate(event.endDate)}
            </div>
          ) : (
            <div className="text-xs text-blue-300 mb-2 flex items-center">
              {new Date(event.startDate) > new Date() ? (
                <>
                  <span>Starts {formatDate(event.startDate)}</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Ends in {formatTimeLeft(event.endDate)}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center">
          <span className="text-blue-200 mr-1 text-xs">
            <Gift className="w-4 h-4" />
          </span>
          <span className="text-xs text-blue-200">
            {event.rewards.length} rewards
          </span>

          {!isPast && (
            <>
              <span className="mx-1 text-blue-500">•</span>
              <span className="text-xs text-blue-200 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {event.participants}
              </span>
            </>
          )}
        </div>

        {!isPast && (
          <div className="flex justify-end">
            <button
              className="text-xs text-blue-600 p-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
