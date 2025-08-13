import { Progress } from "@/components/ui/progress";

export const ProgressBar = ({ progress, statusText }) => {
    const isReconnecting = progress < 0;
    const progressValue = isReconnecting ? 100 : Math.min(100, Math.max(0, progress));

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                    {statusText || (isReconnecting ? 'Reconnecting...' : `${progress}%`)}
                </span>
                <span className="text-sm text-muted-foreground">
                    {isReconnecting ? '🔄' : `${progressValue}%`}
                </span>
            </div>
            <Progress value={progressValue} className={isReconnecting ? "bg-amber-200 dark:bg-amber-900/30" : ""} />
        </div>
    );
};