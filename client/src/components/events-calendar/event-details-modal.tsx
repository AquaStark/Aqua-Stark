"use client";

import {
  X,
  Calendar,
  MapPin,
  Check,
  Bell,
  Gift,
  Star,
  CircleCheckBig,
  Users,
  Info,
  Trophy,
  Sparkles,
  Flame,
} from "lucide-react";

// Moved utility function directly into component
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

interface EventDetailsModalProps {
  event: any;
  onClose: () => void;
}

export function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const isRegistered = event.isRegistered;
  const isUpcoming = new Date(event.startDate) > new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative bg-blue-800 rounded-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Event Details</h2>
          <button onClick={onClose} className="text-white hover:text-blue-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Image */}
        <div className="relative h-36 bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt=""
                className="w-10 h-10"
              />
            </div>
          </div>

          {/* Event Tag */}
          <div className="absolute top-4 right-4">
            <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center">
              <Sparkles className="w-4 mr-1" /> Special Event
            </span>
          </div>

          {/* Active Now Badge */}
          {!isUpcoming && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center">
                <span className="mr-2">
                  <Flame className="w-4" />
                </span>
                Active Now
              </span>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className="p-6 pt-2">
          <h1 className="text-xl font-bold text-white mb-2">{event.title}</h1>

          <div className="flex items-center text-blue-200 mb-4 text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
            <span className="mx-2">•</span>
            <MapPin className="w-4 h-4 mr-1" />
            <span>{event.location}</span>
          </div>

          <p className="text-blue-100 mb-4 text-sm">{event.description}</p>

          {!isUpcoming && event.progress !== undefined && (
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-blue-200">Event Progress</span>
                <span className="text-sm font-medium text-blue-100">
                  {event.progress}%
                </span>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${event.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Rewards */}
            <div>
              <h3 className="flex items-center text-md font-semibold text-white mb-2">
                <span className="text-blue-300 mr-2">
                  <Gift className="h-4 w-4" />
                </span>{" "}
                Rewards
              </h3>
              <ul className="space-y-2 text-xs bg-blue-700/40 p-2 rounded-md">
                {event.rewards.map((reward: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-400 mr-2">
                      <Star className="w-3 h-3" />
                    </span>
                    <span className="text-blue-100">{reward}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="flex items-center text-md font-semibold text-white mb-2">
                <span className="text-blue-300 mr-2">
                  <Info className="h-4 w-4" />
                </span>{" "}
                Requirements
              </h3>
              <ul className="space-y-2 text-xs bg-blue-700/40 p-2 rounded-md">
                {event.requirements.map((req: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <CircleCheckBig className="w-4 h-4 text-green-400 mr-2 mt-0.5" />
                    <span className="text-blue-100">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Participation */}
          <div className="mb-6 bg-blue-700/40 p-2 rounded-md">
            <h3 className="flex items-center text-md font-semibold text-white mb-3">
              <Users className="w-4 h-4 text-blue-300 mr-2" /> Participation
            </h3>
            <p className="text-blue-100 mb-1 text-xs">
              {event.participants} players have joined this event.
            </p>
            <p className="text-yellow-400 flex items-center text-xs">
              <span className="text-lg mr-2">
                <Trophy className="w-3 h-3" />
              </span>{" "}
              Top players will be featured on the leaderboard!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 text-sm">
            <button className="bg-white hover:bg-white/80 text-blue-300 px-6 py-2 rounded-lg flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Set Reminder
            </button>

            {isRegistered ? (
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Registered
              </button>
            ) : (
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Register Now
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
