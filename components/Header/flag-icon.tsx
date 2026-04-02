import { cn } from "@/lib/utils";

type FlagIconProps = {
  locale: "th" | "en";
  className?: string;
};

export function FlagIcon({ locale, className }: FlagIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-white/80 shadow-sm shadow-sky-100/70",
        className,
      )}
    >
      {locale === "th" ? <ThaiFlag /> : <UkFlag />}
    </span>
  );
}

function ThaiFlag() {
  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#C81E3A" height="64" width="64" />
      <rect fill="white" height="11" width="64" y="13" />
      <rect fill="#2448A6" height="16" width="64" y="24" />
      <rect fill="white" height="11" width="64" y="40" />
    </svg>
  );
}

function UkFlag() {
  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="uk-circle">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-circle)">
        <rect fill="#1F3F95" height="64" width="64" />

        <path d="M-6 6L6 -6L70 58L58 70L-6 6Z" fill="white" />
        <path d="M58 -6L70 6L6 70L-6 58L58 -6Z" fill="white" />

        <path d="M-6 10L2 2L66 66L58 74L-6 10Z" fill="#C81E3A" />
        <path d="M54 -6L62 2L-2 66L-10 58L54 -6Z" fill="#C81E3A" />

        <rect fill="white" height="18" width="64" y="23" />
        <rect fill="white" height="64" width="18" x="23" />

        <rect fill="#C81E3A" height="10" width="64" y="27" />
        <rect fill="#C81E3A" height="64" width="10" x="27" />
      </g>
    </svg>
  );
}
