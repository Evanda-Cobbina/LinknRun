import { useEffect, useState, type RefObject } from "react";

/**
 * For a tall "scroll track" that contains a position: sticky child
 * (see Download.tsx's .get-moving-track / .get-moving-sticky), this
 * reports how far through that sticky-pinned range the person has
 * scrolled, as 0 to 1.
 *
 * 0   -> the sticky content has just locked in place
 * 1   -> the track is about to release the sticky content and let
 *        the next section scroll up normally
 *
 * This is different math from useScrollProgress (which tracks the
 * whole page) — this one only cares about the scroll distance inside
 * one specific tall element.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function measure() {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollableWithin = rect.height - window.innerHeight;

      if (scrollableWithin <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }

      const raw = -rect.top / scrollableWithin;
      setProgress(Math.min(1, Math.max(0, raw)));
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          measure();
          ticking = false;
        });
        ticking = true;
      }
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}
