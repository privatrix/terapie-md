import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardEmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function DashboardEmptyState({
    icon: Icon,
    title,
    description,
    action,
    className
}: DashboardEmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 text-center",
            "bg-white rounded-3xl shadow-sm border border-gray-50 p-10",
            className
        )}>
            <div className="mb-6">
                <Icon className="h-16 w-16 text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-8 text-center leading-relaxed">
                {description}
            </p>
            {action && (
                <Button onClick={action.onClick} variant="default" className="rounded-xl px-6">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
