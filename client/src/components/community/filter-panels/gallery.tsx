"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunity } from "@/hooks/use-community";
import { Input } from "@/components/ui/input";

export function FilterPanel() {
  const { filters, setFilters, resetFilters } = useCommunity();

  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-4 animate-in fade-in-50 duration-200">
      <div className="flex justify-between gap-10 mb-4">
        <div className="w-1/3">
          <h3 className="font-bold text-white mb-1">Search</h3>
          <Input
            className="bg-blue-800/50 border-blue-500 w-full"
            placeholder="Enter search query"
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
          />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Likes & Comments range filters */}
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-white mb-2">Likes</h3>
            <div className="px-2">
              <Slider
                defaultValue={[filters.minLikes, filters.maxLikes]}
                max={1000}
                step={25}
                onValueChange={(value) => {
                  setFilters({
                    ...filters,
                    minLikes: value[0],
                    maxLikes: value[1],
                  });
                }}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-blue-200">
                <span>{filters.minLikes} likes</span>
                <span>{filters.maxLikes} likes</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Comments</h3>
            <div className="px-2">
              <Slider
                defaultValue={[filters.minComments, filters.maxComments]}
                max={100}
                step={1}
                onValueChange={(value) => {
                  setFilters({
                    ...filters,
                    minComments: value[0],
                    maxComments: value[1],
                  });
                }}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-blue-200">
                <span>{filters.minComments} comments</span>
                <span>{filters.maxComments} comments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sort options */}
        <div>
          <h3 className="font-bold text-white mb-2">Sort By</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "name", label: "Name" },
              { value: "owner", label: "Owner" },
              { value: "likes-low", label: "Likes: Low to High" },
              { value: "likes-high", label: "Likes: High to Low" },
              { value: "recent", label: "Recent" },
            ].map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={cn(
                  "border-blue-600/50 text-blue-100",
                  filters.sort === option.value
                    ? "bg-blue-700/70 border-blue-500/70"
                    : "bg-blue-800/30 hover:bg-blue-700/50"
                )}
                onClick={() => {
                  setFilters({
                    ...filters,
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
    </div>
  );
}
