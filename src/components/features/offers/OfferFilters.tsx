"use client";

import { Search, MapPin, ArrowUpDown } from "lucide-react";
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
    sortBy: "price_asc" | "price_desc" | "title" | "newest";
    onSortChange: (sort: "price_asc" | "price_desc" | "title" | "newest") => void;
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
        <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-6 md:mb-8">
                Găsește Oferte
            </h2>

            <div className="flex flex-col xl:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Search className="h-5 w-5" />
                    </div>
                    <input
                        className="w-full h-12 md:h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-transparent ring-offset-white focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-base placeholder:text-muted-foreground/70"
                        placeholder="Caută oferte..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-3">
                    {/* Location Filter */}
                    <Select
                        value={locationFilter === "" ? "all" : locationFilter}
                        onValueChange={(val) => onLocationChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="h-12 md:h-14 w-full xl:w-[200px] px-4 rounded-2xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <MapPin className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {locationFilter === "" ? "Locație" :
                                        locationFilter === "chisinau" ? "Chișinău" :
                                            locationFilter === "online" ? "Online" :
                                                "Alte locații"}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 min-w-[200px]">
                            <SelectItem value="all" className="rounded-lg focus:bg-slate-50">Toate Locațiile</SelectItem>
                            <SelectItem value="chisinau" className="rounded-lg focus:bg-slate-50">Chișinău</SelectItem>
                            <SelectItem value="online" className="rounded-lg focus:bg-slate-50">Online</SelectItem>
                            <SelectItem value="other" className="rounded-lg focus:bg-slate-50">Alte locații</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort Filter */}
                    <Select
                        value={sortBy}
                        onValueChange={(value) => onSortChange(value as any)}
                    >
                        <SelectTrigger className="h-12 md:h-14 w-full xl:w-[240px] px-4 rounded-2xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <ArrowUpDown className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {sortBy === "price_asc" ? "Preț: Crescător" :
                                        sortBy === "price_desc" ? "Preț: Descrescător" :
                                            sortBy === "title" ? "Nume: A-Z" :
                                                "Cele mai noi"}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 min-w-[240px]">
                            <SelectItem value="newest" className="rounded-lg focus:bg-slate-50">Cele mai noi</SelectItem>
                            <SelectItem value="price_asc" className="rounded-lg focus:bg-slate-50">Preț: Crescător</SelectItem>
                            <SelectItem value="price_desc" className="rounded-lg focus:bg-slate-50">Preț: Descrescător</SelectItem>
                            <SelectItem value="title" className="rounded-lg focus:bg-slate-50">Nume: A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
