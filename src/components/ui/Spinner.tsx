import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Spinner({ size = "md", className, text }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-14 h-14 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-border border-t-accent-red animate-spin",
          sizeClasses[size]
        )}
      />
      {text && <p className="text-text-secondary text-sm">{text}</p>}
    </div>
  );
}
