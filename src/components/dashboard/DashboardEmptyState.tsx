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
            className
        )}>
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Icon className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                {description}
            </p>
            {action && (
                <Button onClick={action.onClick} variant="outline">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
