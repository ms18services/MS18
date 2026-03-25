"use client";

import { type ReactNode } from "react";

export type PillVariant = "outline" | "filled";

function Pill({
  children,
  variant,
  outlineColorClass,
  filledColorClass,
  textColorClass,
  className,
}: {
  children: ReactNode;
  variant: PillVariant;
  outlineColorClass: string;
  filledColorClass: string;
  textColorClass: string;
  className?: string;
}) {
  if (variant === "filled") {
    return (
      <span
        className={`group relative inline-flex cursor-default items-center rounded-full ${className ?? ""}`}
      >
        <span
          className={`inline-flex items-center rounded-full bg-white px-4 py-1 text-[11px] font-bold ring-1 ${outlineColorClass} ${textColorClass}`}
        >
          {children}
        </span>
        <span
          className={`pointer-events-none absolute inset-0 inline-flex items-center justify-center rounded-full px-4 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${filledColorClass}`}
        >
          {children}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-white px-4 py-1 text-[11px] font-bold ring-1 ${outlineColorClass} ${textColorClass} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export function AvailablePill({
  variant = "outline",
  className,
}: {
  variant?: PillVariant;
  className?: string;
}) {
  return (
    <Pill
      variant={variant}
      outlineColorClass="ring-[#16A34A]"
      filledColorClass="bg-gradient-to-r from-[#3F942A] to-[#1F5711]"
      textColorClass="text-[#16A34A]"
      className={className}
    >
      AVAILABLE
    </Pill>
  );
}

export function UnavailablePill({
  variant = "outline",
  className,
}: {
  variant?: PillVariant;
  className?: string;
}) {
  return (
    <Pill
      variant={variant}
      outlineColorClass="ring-[#DC2626]"
      filledColorClass="bg-[#B91C1C]"
      textColorClass="text-[#DC2626]"
      className={className}
    >
      UNAVAILABLE
    </Pill>
  );
}

export function RemotePill({
  variant = "outline",
  className,
}: {
  variant?: PillVariant;
  className?: string;
}) {
  return (
    <Pill
      variant={variant}
      outlineColorClass="ring-[#2563EB]"
      filledColorClass="bg-gradient-to-r from-[#1D4ED8] to-[#0B3B97]"
      textColorClass="text-[#2563EB]"
      className={className}
    >
      REMOTE
    </Pill>
  );
}

export function OnSitePill({
  variant = "outline",
  className,
}: {
  variant?: PillVariant;
  className?: string;
}) {
  return (
    <Pill
      variant={variant}
      outlineColorClass="ring-[#FF7A00]"
      filledColorClass="bg-gradient-to-r from-[#FF7A00] to-[#9A3412]"
      textColorClass="text-[#FF7A00]"
      className={className}
    >
      ON-SITE
    </Pill>
  );
}
