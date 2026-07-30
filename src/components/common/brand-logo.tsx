import logoDark from "@/assets/logo-rayol-dark.png";
import logoLight from "@/assets/logo-rayol-light.png";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ variant = "dark", className, priority = false }: BrandLogoProps) {
  return (
    <img
      src={variant === "dark" ? logoDark : logoLight}
      alt="Rayol Bistrô Terra & Mar"
      width={1040}
      height={315}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      className={cn("h-auto w-full select-none object-contain", className)}
    />
  );
}
