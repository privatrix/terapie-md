import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    className?: string;
    iconColor?: string; // e.g., "text-green-600"
    iconBgColor?: string; // e.g., "bg-green-100"
}

export function DashboardStatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
    iconColor = "text-blue-600",
    iconBgColor = "bg-blue-50"
}: DashboardStatsCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-200",
            "bg-white border border-gray-100",
            "shadow-sm hover:shadow-md",
            "rounded-2xl",
            className
        )}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {title}
                    </h3>
                    <div className={cn("flex items-center justify-center h-10 w-10 rounded-full", iconBgColor)}>
                        <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-4xl font-black text-gray-900">
                        {value}
                    </div>
                    {(description || trend) && (
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            {trend && <span className="text-green-600 font-medium">{trend}</span>}
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
