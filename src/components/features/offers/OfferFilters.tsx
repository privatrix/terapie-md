"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OfferFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: "price" | "title";
    onSortChange: (sort: "price" | "title") => void;
    locationFilter: string;
    onLocationChange: (location: string) => void;
}

export function OfferFilters({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    locationFilter,
    onLocationChange,
}: OfferFiltersProps) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm md:p-6 space-y-6">
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Caută oferte..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filters Grid: 2 Columns on Desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Locație
                        </label>
                        <Select
                            value={locationFilter === "" ? "all" : locationFilter}
                            onValueChange={(val) => onLocationChange(val === "all" ? "" : val)}
                        >
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Toate Locațiile" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-[100]">
                                <SelectItem value="all">Toate Locațiile</SelectItem>
                                <SelectItem value="chisinau">Chișinău</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="other">Alte locații</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Sortează
                        </label>
                        <Select
                            value={sortBy}
                            onValueChange={(value) => onSortChange(value as "price" | "title")}
                        >
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Sortează după" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-[100]">
                                <SelectItem value="price">Preț (Crescător)</SelectItem>
                                <SelectItem value="title">Nume (A-Z)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
