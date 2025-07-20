import { LoaderIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export function Preloader({ visible = true, className = "", size = 64 }) {
    if (!visible) return null;
    return <div className="flex items-center justify-center my-auto fixed inset-0 z-[9999] bg-white/60 dark:bg-black/60 backdrop-blur-sm">
        <LoaderIcon className={cn("animate-spin text-primary", className)} size={size} /> 
        &nbsp; Loading...
    </div>;
}