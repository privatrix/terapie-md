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
    iconColor = "text-primary",
    iconBgColor = "bg-primary/10"
}: DashboardStatsCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300",
            "bg-white/80 backdrop-blur-md border border-border/50",
            "shadow-sm hover:shadow-md hover:-translate-y-1",
            "rounded-2xl",
            className
        )}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {title}
                    </h3>
                    <div className={cn("p-2 rounded-full", iconBgColor)}>
                        <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-4xl font-black tracking-tight text-foreground">
                        {value}
                    </div>
                    {(description || trend) && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            {trend && <span className="text-green-600 font-medium">{trend}</span>}
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
