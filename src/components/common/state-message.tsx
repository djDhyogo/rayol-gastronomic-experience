import { CloudOff, RefreshCw, SearchX, TriangleAlert } from "lucide-react";

type StateVariant = "error" | "empty" | "offline";

const ICONS = {
  error: TriangleAlert,
  empty: SearchX,
  offline: CloudOff,
} as const;

interface StateMessageProps {
  variant: StateVariant;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function StateMessage({
  variant,
  title,
  description,
  actionLabel,
  onAction,
}: StateMessageProps) {
  const Icon = ICONS[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className="mx-auto flex max-w-md flex-col items-center rounded-lg border border-border bg-card px-6 py-14 text-center"
    >
      <Icon className="size-6 text-brand-clay" aria-hidden="true" />
      <h2 className="mt-5 font-display text-xl text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
