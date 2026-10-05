import { cn } from "@/utils/cn";

interface ComboboxLoadingProps {
    children?: React.ReactNode;
    className?: string;
}

export function ComboboxLoading({
    children = "Loading...",
    className,
}: ComboboxLoadingProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "px-2 py-3 text-center text-sm text-text-muted",
                className
            )}
        >
            {children}
        </div>
    );
}