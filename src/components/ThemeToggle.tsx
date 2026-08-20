import { useTheme } from "../hooks/useTheme";
import "./ThemeToggle.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
    >
      {isLight ? (
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
          <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4M15.5 15.5l-1.4-1.4M5.9 5.9 4.5 4.5"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
          <path
            fill="currentColor"
            d="M17 11.5A7 7 0 0 1 8.5 3 7 7 0 1 0 17 11.5"
          />
        </svg>
      )}
    </button>
  );
}
