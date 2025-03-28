
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AvatarWithStatusProps = {
  src?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "away" | "busy" | "none";
  className?: string;
};

export function AvatarWithStatus({
  src,
  fallback,
  size = "md",
  status = "none",
  className,
}: AvatarWithStatusProps) {
  const statusColors = {
    online: "bg-rainbow-green",
    offline: "bg-muted-foreground",
    away: "bg-rainbow-yellow",
    busy: "bg-rainbow-red",
    none: "hidden",
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const statusSizeClasses = {
    sm: "h-2.5 w-2.5 right-0 bottom-0",
    md: "h-3 w-3 right-0 bottom-0",
    lg: "h-3.5 w-3.5 right-0.5 bottom-0.5",
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={src} alt={fallback} />
        <AvatarFallback className="bg-primary/20 text-primary">
          {fallback
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {status !== "none" && (
        <span
          className={cn(
            "absolute border-2 border-background rounded-full",
            statusColors[status],
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
}
