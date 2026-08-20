import raw from "./site-content.json";
import type { SiteContent } from "./types";

// Single import point for content across the app.
// Swap site-content.json for a CMS/API call later without
// touching any component — they only ever import `content`.
export const content = raw as SiteContent;
