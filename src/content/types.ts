// ─────────────────────────────────────────────────────────────
// Content types
//
// Everything a non-developer might want to change lives in
// site-content.json, shaped by these types. If LinknRun moves to
// a CMS or admin panel later, this file is the contract that
// panel would need to satisfy — keep it in sync with any schema
// changes on that end.
// ─────────────────────────────────────────────────────────────

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string; // path or URL, swap freely
  bio: string;
  socials: SocialLinks;
}

export interface ValueProp {
  id: string;
  label: string; // short eyebrow, e.g. "Partners"
  headline: string;
  body: string;
}

export interface ShowcaseFrame {
  id: string;
  image: string; // placeholder path or URL
  caption: string;
}

export interface NetworkFeature {
  id: "map" | "chat" | "addFriend";
  headline: string;
  body: string;
}

export interface DownloadLinks {
  googlePlayUrl: string; // placeholder until the listing is live
  directDownloadUrl: string; // placeholder until a direct build is hosted
  googlePlayLive: boolean; // flip true once googlePlayUrl is real
  directDownloadLive: boolean; // flip true once directDownloadUrl is real
}

export interface DownloadHighlight {
  id: string;
  label: string;
  body: string;
}

export interface SiteContent {
  brand: {
    name: string;
    wordmarkImage: string; // the image logo actually used
    tagline: string;
  };
  nav: {
    links: { label: string; href: string }[];
    ctaLabel: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  valueProps: ValueProp[];
  network: {
    eyebrow: string;
    headline: string;
    body: string;
    features: NetworkFeature[];
  };
  showcase: {
    eyebrow: string;
    headline: string;
    body: string;
    frames: ShowcaseFrame[];
  };
  download: {
    eyebrow: string;
    headline: string;
    body: string;
    links: DownloadLinks;
    highlights: DownloadHighlight[];
  };
  team: {
    eyebrow: string;
    headline: string;
    body: string;
    members: TeamMember[];
  };
  footer: {
    tagline: string;
    links: { label: string; href: string }[];
  };
}
