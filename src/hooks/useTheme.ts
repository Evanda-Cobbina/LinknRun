import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "linknrun-theme";

// Every component that calls useTheme() gets its own independent
// React state — there's no shared context here. Without this event,
// toggling the theme in one component (e.g. the Nav's ThemeToggle)
// updated the DOM attribute and localStorage, but had no way to tell
// OTHER components already using useTheme() (e.g. ShoeScene) that
// anything changed — they'd only pick up the new value on next mount,
// which in practice meant "only after a full page refresh." This
// event is what closes that gap without needing a context provider.
const THEME_CHANGE_EVENT = "linknrun:theme-change";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(
    new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme })
  );
}

/**
 * Reads the theme index.html already set on <html> (so there's no flash
 * on load), and gives back a value + setter for a manual toggle button.
 *
 * Rule: if the person has NEVER manually toggled (nothing saved yet),
 * this keeps following their OS setting live — if they flip their
 * system to light mode while the tab is open, the site follows. The
 * moment they click the toggle once, that choice is saved and the site
 * stops auto-following the OS from then on.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "light" || attr === "dark" ? attr : "dark";
  });

  useEffect(() => {
    // Every instance listens for every toggle, including its own —
    // this is what keeps ShoeScene (and anything else calling
    // useTheme()) in sync with a click that happened somewhere else
    // in the tree, immediately, with no refresh needed.
    function handleThemeChange(event: Event) {
      const detail = (event as CustomEvent<Theme>).detail;
      if (detail === "light" || detail === "dark") {
        setTheme(detail);
      }
    }

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () =>
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  useEffect(() => {
    if (readStoredTheme()) return;

    const media = window.matchMedia("(prefers-color-scheme: light)");
    function handleChange() {
      if (readStoredTheme()) return;
      applyTheme(getSystemTheme());
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private browsing etc.) — theme still
      // applies for this session, it just won't persist on reload.
    }
  }

  return { theme, toggleTheme };
}
