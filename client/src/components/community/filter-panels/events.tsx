"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunity } from "@/hooks/use-community";
import { Input } from "@/components/ui/input";

export function FilterPanel() {
  const { eventFilters, setEventFilters, resetFilters } = useCommunity();

  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-4 animate-in fade-in-50 duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* No of Participants range filters */}
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-white mb-2">Search</h3>
            <Input
              className="bg-blue-800/50 border-blue-500"
              placeholder="Search events"
              onChange={(e) =>
                setEventFilters({
                  ...eventFilters,
                  search: e.target.value,
                })
              }
            />
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">
              Number of Participants
            </h3>
            <div className="px-2">
              <Slider
                defaultValue={[
                  eventFilters.minParticipants,
                  eventFilters.maxParticipants,
                ]}
                max={100}
                step={1}
                onValueChange={(value) => {
                  setEventFilters({
                    ...eventFilters,
                    minParticipants: value[0],
                    maxParticipants: value[1],
                  });
                }}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-blue-200">
                <span>{eventFilters.minParticipants} participants</span>
                <span>{eventFilters.maxParticipants} participants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sort options */}
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-white mb-2">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "upcoming", label: "Upcoming" },
                { value: "past", label: "Ended" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-blue-600/50 text-blue-100",
                    eventFilters.status === option.value
                      ? "bg-blue-700/70 border-blue-500/70"
                      : "bg-blue-800/30 hover:bg-blue-700/50"
                  )}
                  onClick={() => {
                    setEventFilters({
                      ...eventFilters,
                      status: option.value as any,
                    });
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Sort By</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "name", label: "Name" },
                { value: "participants", label: "Number of Participants" },
                { value: "recent", label: "Recent" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-blue-600/50 text-blue-100",
                    eventFilters.sort === option.value
                      ? "bg-blue-700/70 border-blue-500/70"
                      : "bg-blue-800/30 hover:bg-blue-700/50"
                  )}
                  onClick={() => {
                    setEventFilters({
                      ...eventFilters,
                      sort: option.value as any,
                    });
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset filters */}
        <div className="flex items-end">
          <Button
            variant="outline"
            className="border-blue-600/50 bg-blue-600 text-blue-100 hover:bg-blue-600/50 hover:text-white/60"
            onClick={resetFilters}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
