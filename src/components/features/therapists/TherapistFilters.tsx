"use client";

import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";

interface TherapistFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: "rating" | "price" | "reviews";
    onSortChange: (sort: "rating" | "price" | "reviews") => void;
    locationFilter: string;
    onLocationChange: (location: string) => void;
}

export function TherapistFilters({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    locationFilter,
    onLocationChange,
}: TherapistFiltersProps) {
    return (
        <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm md:p-6">
            {/* Search Bar - Full Width */}
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Caută după nume sau specialitate..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Sort and Location Filters Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Sort Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sortează:</span>
                    <Button
                        variant={sortBy === "rating" ? "default" : "outline"}
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => onSortChange("rating")}
                    >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Rating
                    </Button>
                    <Button
                        variant={sortBy === "price" ? "default" : "outline"}
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => onSortChange("price")}
                    >
                        Preț
                    </Button>
                    <Button
                        variant={sortBy === "reviews" ? "default" : "outline"}
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => onSortChange("reviews")}
                    >
                        Recenzii
                    </Button>
                </div>

                {/* Location Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Locație:</span>
                    <Button
                        variant={locationFilter === "" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onLocationChange("")}
                    >
                        Toate
                    </Button>
                    <Button
                        variant={locationFilter === "chisinau" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onLocationChange("chisinau")}
                    >
                        Chișinău
                    </Button>
                    <Button
                        variant={locationFilter === "online" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onLocationChange("online")}
                    >
                        Online
                    </Button>
                    <Button
                        variant={locationFilter === "other" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onLocationChange("other")}
                    >
                        Alte orașe
                    </Button>
                </div>
            </div>
        </div>
    );
}
