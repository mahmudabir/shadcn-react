import { LoaderIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { usePreloader } from "../providers/preloader-provider";

export function Preloader({ visible = true, className = "", size = 64 }) {

    const { setVisible, setManual } = usePreloader();

    const animationClassName = visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none";
    return (
        <div onClick={() => {
            setManual(false);
        }}
            className={cn(
                "flex items-center justify-center my-auto fixed",
                "inset-0 z-[9999]",
                "bg-white/60 dark:bg-black/60",
                "backdrop-blur-sm transition-opacity duration-100 ease-in-out",
                animationClassName,
                className
            )}
        >
            <LoaderIcon className={cn("animate-spin text-primary", className)} size={size} />
            &nbsp; Loading...
        </div>
    );
}