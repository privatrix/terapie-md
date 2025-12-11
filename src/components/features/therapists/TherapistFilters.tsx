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

interface TherapistFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: "rating" | "price" | "reviews";
    onSortChange: (sort: "rating" | "price" | "reviews") => void;
    locationFilter: string;
    onLocationChange: (location: string) => void;
    roleFilter: string;
    onRoleChange: (role: string) => void;
}

const PROFESSIONAL_ROLES = [
    "Psiholog Clinician",
    "Psihoterapeut",
    "Consilier",
    "Coach",
    "Psihiatru"
];

export function TherapistFilters({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    locationFilter,
    onLocationChange,
    roleFilter,
    onRoleChange,
}: TherapistFiltersProps) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm md:p-6 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold font-heading">
                Găsește Terapeutul
            </h2>
            {/* Top Row: Search and Sort */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                {/* Search Bar - Flexible Width */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Caută după nume sau specialitate..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Sort Dropdown - Fixed Width on Desktop */}
                <div className="w-full sm:w-[200px]">
                    <Select
                        value={sortBy}
                        onValueChange={(value) => onSortChange(value as "rating" | "price" | "reviews")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sortează după" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rating">Rating (Desc)</SelectItem>
                            <SelectItem value="reviews">Nr. Recenzii</SelectItem>
                            <SelectItem value="price">Preț (Crescător)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* Filters Grid - 2 Columns on Desktop */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Role/Specialization Section */}
                <div className="space-y-3 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                        Tip Specialist
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar [&::-webkit-scrollbar]:hidden">
                        <Button
                            variant={roleFilter === "" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onRoleChange("")}
                            className="whitespace-nowrap transition-all"
                        >
                            Toți
                        </Button>
                        {PROFESSIONAL_ROLES.map(role => (
                            <Button
                                key={role}
                                variant={roleFilter === role ? "default" : "outline"}
                                size="sm"
                                onClick={() => onRoleChange(role)}
                                className="whitespace-nowrap transition-all"
                            >
                                {role}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Location Section */}
                <div className="space-y-3 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                        Locație
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar [&::-webkit-scrollbar]:hidden">
                        <Button
                            variant={locationFilter === "" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onLocationChange("")}
                            className="whitespace-nowrap transition-all"
                        >
                            Toate
                        </Button>
                        <Button
                            variant={locationFilter === "chisinau" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onLocationChange("chisinau")}
                            className="whitespace-nowrap transition-all"
                        >
                            Chișinău
                        </Button>
                        <Button
                            variant={locationFilter === "online" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onLocationChange("online")}
                            className="whitespace-nowrap transition-all"
                        >
                            Online
                        </Button>
                        <Button
                            variant={locationFilter === "other" ? "default" : "outline"}
                            size="sm"
                            onClick={() => onLocationChange("other")}
                            className="whitespace-nowrap transition-all"
                        >
                            Alte orașe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
