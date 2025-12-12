"use client";

import { Search, Users, MapPin, ArrowUpDown } from "lucide-react";
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

import { CITIES, THERAPIST_SPECIALIZATIONS } from "@/lib/constants";

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
        <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-6 md:mb-8">
                Găsește Terapeutul
            </h2>

            <div className="flex flex-col xl:flex-row gap-4">
                {/* Search Bar - Grows to fill space */}
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Search className="h-5 w-5" />
                    </div>
                    <input
                        className="w-full h-12 md:h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-transparent ring-offset-white focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-base placeholder:text-muted-foreground/70"
                        placeholder="Caută nume, specializare..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filters Row - Grid on mobile, Flex on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex gap-3">
                    {/* Role Filter */}
                    <Select
                        value={roleFilter === "" ? "all" : roleFilter}
                        onValueChange={(val) => onRoleChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="h-12 md:h-14 w-full xl:w-[200px] px-4 rounded-2xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <Users className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {roleFilter === "" ? "Tip Specialist" : roleFilter}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 w-[240px]">
                            <SelectItem value="all" className="rounded-lg focus:bg-slate-50">Toți Specialiștii</SelectItem>
                            {THERAPIST_SPECIALIZATIONS.map(role => (
                                <SelectItem key={role} value={role} className="rounded-lg focus:bg-slate-50">{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Location Filter */}
                    <Select
                        value={locationFilter === "" ? "all" : locationFilter}
                        onValueChange={(val) => onLocationChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="h-12 md:h-14 w-full xl:w-[180px] px-4 rounded-2xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <MapPin className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {locationFilter === "" ? "Locație" : locationFilter}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 min-w-[180px]">
                            <SelectItem value="all" className="rounded-lg focus:bg-slate-50">Toate Locațiile</SelectItem>
                            {CITIES.map(city => (
                                <SelectItem key={city} value={city} className="rounded-lg focus:bg-slate-50">{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort Filter */}
                    <Select
                        value={sortBy}
                        onValueChange={(value) => onSortChange(value as "rating" | "price" | "reviews")}
                    >
                        <SelectTrigger className="h-12 md:h-14 w-full xl:w-[220px] px-4 rounded-2xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <ArrowUpDown className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {sortBy === "rating" ? "Rating (Desc)" :
                                        sortBy === "reviews" ? "Nr. Recenzii" :
                                            "Preț (Crescător)"}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 min-w-[200px]">
                            <SelectItem value="rating" className="rounded-lg focus:bg-slate-50">Rating (Cel mai mare)</SelectItem>
                            <SelectItem value="reviews" className="rounded-lg focus:bg-slate-50">Număr Recenzii</SelectItem>
                            <SelectItem value="price" className="rounded-lg focus:bg-slate-50">Preț (Cel mai mic)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
