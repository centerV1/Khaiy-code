import { useId } from "react";

import { cn } from "@/lib/utils";

type FlagIconProps = {
  locale: "th" | "en";
  className?: string;
};

export function FlagIcon({ locale, className }: FlagIconProps) {
  const clipPathId = useId();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-full border border-white/85 bg-white p-0.5 shadow-sm shadow-sky-100/70 ring-1 ring-slate-200/35",
        className,
      )}
    >
      {locale === "th" ? (
        <ThaiFlag clipPathId={clipPathId} />
      ) : (
        <EnglishFlag clipPathId={clipPathId} />
      )}
    </span>
  );
}

function ThaiFlag({ clipPathId }: { clipPathId: string }) {
  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipPathId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <rect fill="#C81E3A" height="64" width="64" />
        <rect fill="white" height="10.67" width="64" y="10.67" />
        <rect fill="#2448A6" height="21.33" width="64" y="21.33" />
        <rect fill="white" height="10.67" width="64" y="42.66" />
      </g>
    </svg>
  );
}

function EnglishFlag({ clipPathId }: { clipPathId: string }) {
  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipPathId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <circle cx="32" cy="32" fill="#1F4AA8" r="32" />

        <g stroke="white" strokeWidth="15">
          <path d="M0 0L64 64" />
          <path d="M64 0L0 64" />
        </g>

        <g stroke="#D81E3A" strokeWidth="7">
          <path d="M0 0L64 64" />
          <path d="M64 0L0 64" />
        </g>

        <rect fill="white" height="20" width="64" y="22" />
        <rect fill="white" height="64" width="20" x="22" />

        <rect fill="#D81E3A" height="12" width="64" y="26" />
        <rect fill="#D81E3A" height="64" width="12" x="26" />
      </g>
    </svg>
  );
}
