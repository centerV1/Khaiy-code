"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CurvedLoopDirection = "left" | "right";

type CurvedLoopProps = {
  marqueeText: string;
  speed?: number;
  curveAmount?: number;
  direction?: CurvedLoopDirection;
  interactive?: boolean;
  className?: string;
};

const BASE_PIXELS_PER_SECOND = 100;
const MIN_SEGMENT_COUNT = 4;

export function CurvedLoop({
  marqueeText,
  speed = 1,
  curveAmount = 0,
  direction = "right",
  interactive = false,
  className,
}: CurvedLoopProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const unitRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [segmentCount, setSegmentCount] = useState(MIN_SEGMENT_COUNT);

  const segmentOffsets = useMemo(
    () =>
      Array.from({ length: segmentCount }, (_, index) => {
        if (!curveAmount) {
          return 0;
        }

        const progress = index / Math.max(segmentCount - 1, 1);
        return Math.sin(progress * Math.PI) * curveAmount;
      }),
    [curveAmount, segmentCount],
  );

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const measure = measureRef.current;

    if (!viewport || !measure) {
      return;
    }

    let resizeFrame: number | null = null;

    const updateSegmentCount = () => {
      const viewportWidth = viewport.offsetWidth;
      const segmentWidth = measure.offsetWidth;

      if (!viewportWidth || !segmentWidth) {
        return;
      }

      const nextCount = Math.max(
        Math.ceil((viewportWidth * 1.35) / segmentWidth),
        MIN_SEGMENT_COUNT,
      );

      setSegmentCount((currentCount) =>
        currentCount === nextCount ? currentCount : nextCount,
      );
    };

    const handleResize = () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      resizeFrame = window.requestAnimationFrame(updateSegmentCount);
    };

    updateSegmentCount();
    void document.fonts?.ready?.then(updateSegmentCount);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      window.removeEventListener("resize", handleResize);
    };
  }, [marqueeText]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const unit = unitRef.current;

    if (!track || !unit) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let resizeFrame: number | null = null;

    const setupAnimation = () => {
      const unitWidth = unit.offsetWidth;

      tweenRef.current?.kill();
      gsap.killTweensOf(track);
      gsap.set(track, { x: 0, force3D: true });

      if (!unitWidth || prefersReducedMotion) {
        return;
      }

      tweenRef.current = gsap.to(track, {
        duration: Math.max(
          unitWidth / (BASE_PIXELS_PER_SECOND * Math.max(speed, 0.25)),
          6,
        ),
        ease: "none",
        force3D: true,
        repeat: -1,
        x: -unitWidth,
      });
    };

    const handleResize = () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      resizeFrame = window.requestAnimationFrame(setupAnimation);
    };

    setupAnimation();
    void document.fonts?.ready?.then(setupAnimation);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      window.removeEventListener("resize", handleResize);
      tweenRef.current?.kill();
      gsap.killTweensOf(track);
      gsap.set(track, { clearProps: "x" });
    };
  }, [marqueeText, segmentCount, speed]);

  const setTimeScale = (value: number) => {
    if (!interactive) {
      return;
    }

    tweenRef.current?.timeScale(value);
  };

  const shouldFlip = direction === "right";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        shouldFlip && "transform-[scaleX(-1)]",
        className,
      )}
      onBlur={() => setTimeScale(1)}
      onFocus={() => setTimeScale(1.08)}
      onMouseEnter={() => setTimeScale(1.12)}
      onMouseLeave={() => setTimeScale(1)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 inline-flex shrink-0 items-center gap-3 opacity-0"
        ref={measureRef}
      >
        <span>{marqueeText}</span>
        <span>•</span>
      </span>

      <div className="overflow-hidden" ref={viewportRef}>
        <div
          className="flex w-max whitespace-nowrap will-change-transform"
          ref={trackRef}
        >
          {[0, 1].map((unitIndex) => (
            <div
              aria-hidden={unitIndex === 1}
              className={cn(
                "flex shrink-0 items-center",
                shouldFlip && "transform-[scaleX(-1)]",
              )}
              key={unitIndex}
              ref={unitIndex === 0 ? unitRef : undefined}
            >
              {segmentOffsets.map((offset, segmentIndex) => (
                <span
                  className="inline-flex shrink-0 items-center gap-3 px-6"
                  key={`${unitIndex}-${segmentIndex}`}
                  style={
                    offset
                      ? { transform: `translateY(${offset.toFixed(2)}px)` }
                      : undefined
                  }
                >
                  <span>{marqueeText}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
