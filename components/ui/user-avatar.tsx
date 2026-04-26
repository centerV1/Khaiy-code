"use client";

import { useState } from "react";

import { getInitials } from "@/lib/site";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  email: string;
  avatarUrl?: string | null;
  className?: string;
  imageClassName?: string;
};

export function UserAvatar({
  email,
  avatarUrl,
  className,
  imageClassName,
}: UserAvatarProps) {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const showImage = Boolean(avatarUrl) && failedAvatarUrl !== avatarUrl;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full text-sm font-semibold",
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={email}
          className={cn("size-full object-cover", imageClassName)}
          referrerPolicy="no-referrer"
          src={avatarUrl ?? ""}
          onError={() => setFailedAvatarUrl(avatarUrl ?? null)}
        />
      ) : (
        getInitials(email)
      )}
    </span>
  );
}
