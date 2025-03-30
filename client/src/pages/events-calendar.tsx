"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  CalendarRange,
  ChevronDown,
  Coins,
  ListFilter,
  Search,
  Sparkles,
  Tag,
  Trophy,
} from "lucide-react";

import { useBubbles } from "@/hooks/useBubbles";
import { BubblesBackground } from "@/components/bubble-background";
import { SpecialEventsView } from "@/components/events-calendar/special-events-view";
import { ListEventView } from "@/components/events-calendar/list-event-view";
import { CalendarView } from "@/components/events-calendar/calendar-view";
import { EventDetailsModal } from "@/components/events-calendar/event-details-modal";
import { AllEventsView } from "@/components/events-calendar/all-events-view";
import { mockEvents } from "@/data/event-calendar-data";

type TabType = "all" | "special" | "seasons" | "tournaments" | "offers";
type ViewType = "list" | "calendar";

export default function EventsCalendar() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [viewType, setViewType] = useState<ViewType>("list");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get tab name for display
  const getTabName = (tab: TabType) => {
    switch (tab) {
      case "all":
        return "All Events";
      case "special":
        return "Special";
      case "seasons":
        return "Seasons";
      case "tournaments":
        return "Tournaments";
      case "offers":
        return "Offers";
      default:
        return "All Events";
    }
  };

  // Get tab icon
  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "all":
        return <Calendar className="w-4 h-4" />;
      case "special":
        return <Sparkles className="w-4 h-4" />;
      case "seasons":
        return <CalendarRange className="w-4 h-4" />;
      case "tournaments":
        return <Trophy className="w-4 h-4" />;
      case "offers":
        return <Tag className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Filter events based on active tab
  const filteredEvents = mockEvents
    ? activeTab === "all"
      ? mockEvents
      : mockEvents.filter((event) => event.category === activeTab)
    : [];

  const bubbles = useBubbles();

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-blue-600 via-blue-800 to-blue-900 text-white">
      <BubblesBackground bubbles={bubbles} animationName="footer-float-up" />

      {/* Header */}
      <nav className="relative z-10 py-4 bg-blue-700 ">
        <div className="flex items-center justify-between  font-sans px-4 lg:px-8 xl:px-16 container mx-auto w-full ">
          <div className="flex items-center">
            <button className="mr-2 text-xs text-white rounded-full hover:bg-blue-500/50 flex items-center p-2">
              <ArrowLeft className="mr-2" width={20} />
              <span className="hidden md:flex">Back to Game</span>
            </button>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              Events Calendar
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center px-2 md:px-4 py-1 md:py-2 border rounded-full bg-blue-700/50 border-blue-400/50">
              <Coins className="mr-2 text-yellow-400 w-4" />
              <span className="font-bold text-white text-sm">12,500</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col px-4 lg:px-8 xl:px-16 container mx-auto">
        {" "}
        {/* Search and View Toggle */}
        <div className="relative z-10 py-4 flex items-center justify-between w-full gap-x-2 md:gap-x-4  ">
          <div className="relative w-full max-w-3xl">
            <input
              type="text"
              placeholder="Search events..."
              className="bg-blue-800/50 w-full flex rounded-md pl-10 pr-4 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                viewType === "list" ? "bg-blue-600" : "bg-blue-800/50"
              }`}
              onClick={() => setViewType("list")}
            >
              <ListFilter className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
              <span className="sm:hidden">List</span>
            </button>
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                viewType === "calendar" ? "bg-blue-600" : "bg-blue-800/50"
              }`}
              onClick={() => setViewType("calendar")}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar View</span>
              <span className="sm:hidden">Calendar</span>
            </button>
          </div>
        </div>
        {/* Tab Navigation - Desktop */}
        <div className="relative z-10 mb-6 hidden md:block ">
          <div className="bg-blue-700 rounded-lg p-1 flex">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium ${
                activeTab === "all" ? "bg-blue-600" : "hover:bg-blue-600/30"
              }`}
              onClick={() => handleTabChange("all")}
            >
              <Calendar className="w-4 h-4" />
              All Events
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium ${
                activeTab === "special" ? "bg-blue-600" : "hover:bg-blue-600/30"
              }`}
              onClick={() => handleTabChange("special")}
            >
              <Sparkles className="w-4 h-4" />
              Special
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium ${
                activeTab === "seasons" ? "bg-blue-600" : "hover:bg-blue-600/30"
              }`}
              onClick={() => handleTabChange("seasons")}
            >
              <CalendarRange className="w-4 h-4" />
              Seasons
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium ${
                activeTab === "tournaments"
                  ? "bg-blue-600"
                  : "hover:bg-blue-600/30"
              }`}
              onClick={() => handleTabChange("tournaments")}
            >
              <Trophy className="w-4 h-4" />
              Tournaments
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium ${
                activeTab === "offers" ? "bg-blue-600" : "hover:bg-blue-600/30"
              }`}
              onClick={() => handleTabChange("offers")}
            >
              <Tag className="w-4 h-4" />
              Offers
            </button>
          </div>
        </div>
        {/* Tab Navigation - Mobile Dropdown */}
        <div className="relative z-20 mb-6 md:hidden">
          <div ref={menuRef} className="relative">
            <button
              className="w-full bg-blue-700 rounded-lg p-3 flex items-center justify-between"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="flex items-center gap-2">
                {getTabIcon(activeTab)}
                <span className="font-medium">{getTabName(activeTab)}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  mobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-blue-800 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-1">
                  {(
                    [
                      "all",
                      "special",
                      "seasons",
                      "tournaments",
                      "offers",
                    ] as TabType[]
                  ).map((tab) => (
                    <button
                      key={tab}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-left rounded-md ${
                        activeTab === tab ? "bg-blue-600" : "hover:bg-blue-700"
                      }`}
                      onClick={() => handleTabChange(tab)}
                    >
                      {getTabIcon(tab)}
                      <span>{getTabName(tab)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Content Area */}
        <div className="relative z-10 pb-16 flex-grow">
          {viewType === "list" && (
            <>
              {activeTab === "all" ? (
                <AllEventsView
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  searchQuery={searchQuery}
                />
              ) : activeTab === "special" ? (
                <SpecialEventsView
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  searchQuery={searchQuery}
                />
              ) : (
                <ListEventView
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  searchQuery={searchQuery}
                />
              )}
            </>
          )}

          {viewType === "calendar" && (
            <CalendarView
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}

          {(activeTab === "seasons" ||
            activeTab === "tournaments" ||
            activeTab === "offers") &&
            filteredEvents.length === 0 && (
              <div className="flex items-center justify-center h-64 bg-blue-800/30 rounded-lg">
                <p className="text-lg text-blue-200">
                  This tab is under development
                </p>
              </div>
            )}
        </div>
      </div>
      {/* Footer */}
      <div className="relative z-10 text-center text-sm text-blue-300 bg-blue-950 py-4 mt-auto">
        <div className="px-4  lg:px-8 xl:px-16 container mx-auto">
          © {new Date().getFullYear()} Aqua Stark - All rights reserved
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={closeModal} />
      )}
    </div>
  );
}
