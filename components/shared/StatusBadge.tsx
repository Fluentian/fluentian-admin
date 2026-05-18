import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = status.toLowerCase();

  let variant: "success" | "warning" | "destructive" | "secondary" | "default" = "secondary";
  let label = status;

  if (s === 'published' || s === 'active') {
    variant = "success";
    label = s.charAt(0).toUpperCase() + s.slice(1);
  } else if (s === 'draft' || s === 'inactive' || s === 'pending') {
    variant = "warning";
    label = s.charAt(0).toUpperCase() + s.slice(1);
  } else if (s === 'pro') {
    return (
      <Badge className={cn("bg-[#6C3BF5]/10 text-[#6C3BF5] border-transparent hover:bg-[#6C3BF5]/10", className)}>
        Pro
      </Badge>
    );
  } else if (s === 'plus') {
    return (
      <Badge className={cn("bg-slate-100 text-slate-700 border-transparent hover:bg-slate-100", className)}>
        Plus
      </Badge>
    );
  } else if (s === 'free') {
    return (
      <Badge variant="secondary" className={className}>
        Free
      </Badge>
    );
  }

  return (
    <Badge variant={variant} className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}
