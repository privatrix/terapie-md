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

            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Caută după nume sau specialitate..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filters Grid: 3 Columns on Desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Role Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Tip Specialist
                        </label>
                        <Select
                            value={roleFilter === "" ? "all" : roleFilter}
                            onValueChange={(val) => onRoleChange(val === "all" ? "" : val)}
                        >
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Toți Specialiștii" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-[100]">
                                <SelectItem value="all">Toți Specialiștii</SelectItem>
                                {PROFESSIONAL_ROLES.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
                                <SelectItem value="other">Alte orașe</SelectItem>
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
                            onValueChange={(value) => onSortChange(value as "rating" | "price" | "reviews")}
                        >
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Sortează după" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-[100]">
                                <SelectItem value="rating">Rating (Desc)</SelectItem>
                                <SelectItem value="reviews">Nr. Recenzii</SelectItem>
                                <SelectItem value="price">Preț (Crescător)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
