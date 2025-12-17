"use client";

import { Search, Users, MapPin, ArrowUpDown, Tag, Brain } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CITIES, THERAPIST_SPECIALIZATIONS, THERAPIST_SPECIALTIES, THERAPIST_APPROACHES } from "@/lib/constants";

interface TherapistFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: "rating" | "price" | "reviews";
    onSortChange: (sort: "rating" | "price" | "reviews") => void;
    locationFilter: string;
    onLocationChange: (location: string) => void;
    roleFilter: string;
    onRoleChange: (role: string) => void;
    specialtyFilter: string;
    onSpecialtyChange: (specialty: string) => void;
    approachFilter: string;
    onApproachChange: (approach: string) => void;
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
    specialtyFilter,
    onSpecialtyChange,
    approachFilter,
    onApproachChange,
}: TherapistFiltersProps) {
    return (
        <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-6 md:mb-8">
                Găsește Terapeutul
            </h2>

            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative w-full group">
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

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                    {/* Role Filter */}
                    <Select
                        value={roleFilter === "" ? "all" : roleFilter}
                        onValueChange={(val) => onRoleChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="h-12 w-full px-4 rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
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

                    {/* Specialty Filter (Issues) */}
                    <Select
                        value={specialtyFilter === "" ? "all" : specialtyFilter}
                        onValueChange={(val) => onSpecialtyChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="h-12 w-full px-4 rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <Tag className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {specialtyFilter === "" ? "Afecțiune" : specialtyFilter}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 w-[240px] max-h-[300px]">
                            <SelectItem value="all" className="rounded-lg focus:bg-slate-50">Toate Afecțiunile</SelectItem>
                            {THERAPIST_SPECIALTIES.map(spec => (
                                <SelectItem key={spec} value={spec} className="rounded-lg focus:bg-slate-50">{spec}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Approach Filter */}
                    <Select
                        value={approachFilter === "" ? "all" : approachFilter}
                        onValueChange={(val) => onApproachChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="h-12 w-full px-4 rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <Brain className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {approachFilter === "" ? "Abordare" : approachFilter}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 w-[240px] max-h-[300px]">
                            <SelectItem value="all" className="rounded-lg focus:bg-slate-50">Toate Abordările</SelectItem>
                            {THERAPIST_APPROACHES.map(app => (
                                <SelectItem key={app} value={app} className="rounded-lg focus:bg-slate-50">{app}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Location Filter */}
                    <Select
                        value={locationFilter === "" ? "all" : locationFilter}
                        onValueChange={(val) => onLocationChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="h-12 w-full px-4 rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                                <MapPin className="h-4 w-4 text-primary/70 shrink-0" />
                                <span className="truncate">
                                    {locationFilter === "" ? "Locație" : locationFilter}
                                </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1 min-w-[180px] max-h-[300px]">
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
                        <SelectTrigger className="h-12 w-full px-4 rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 transition-all text-left font-medium">
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
