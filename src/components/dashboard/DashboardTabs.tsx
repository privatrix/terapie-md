
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Wrapper for TabsList to create the "Segmented Control" container
export function DashboardTabsList({ className, ...props }: React.ComponentProps<typeof TabsList>) {
    return (
        <TabsList
            className={cn(
                "inline-flex p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl h-auto",
                className
            )}
            {...props}
        />
    );
}

// Wrapper for TabsTrigger to create the "Segmented Control" button
export function DashboardTabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) {
    return (
        <TabsTrigger
            className={cn(
                "rounded-lg py-2 px-4 transition-all duration-200",
                "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50",
                "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
                className
            )}
            {...props}
        />
    );
}
