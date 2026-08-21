HEAD

# LinknRun website

The public marketing site for LinknRun, the social jogging app by FlameCore.
Single scroll page: hero, what the app does, an app preview, download, and
the team.

## Stack

- React + TypeScript
- Plain CSS (no framework) — tokens live in `src/styles/variables.css`
- Vite

## Running it

```
npm install
npm run dev
```

Build for production with `npm run build`. Output lands in `dist/`.

## Where to change things

Nearly everything a non-developer would want to touch lives in one file:

**`src/content/site-content.json`**

- Hero headline, subhead, and button labels
- The four value prop cards (About section)
- App preview captions and images (Showcase section)
- Download links — see below
- Team members — see below
- Footer links

The shape of that file is defined in `src/content/types.ts`. If this ever
moves to a real CMS or admin panel, that types file is the contract the
CMS needs to satisfy — the components never read the JSON directly, they
only import `content` from `src/content/index.ts`, so swapping the source
later (an API call instead of a local JSON file) shouldn't require
touching any component.

### Download links

`download.links` in the JSON has four fields:

```json
"links": {
  "googlePlayUrl": "#",
  "directDownloadUrl": "#",
  "googlePlayLive": false,
  "directDownloadLive": false
}
```

Drop the real URL into `googlePlayUrl` / `directDownloadUrl`, then flip the
matching `*Live` flag to `true`. Until a flag is `true`, that button is
shown greyed out and the "links go live soon" note stays visible.

### Team members

Add, remove, or edit people in `team.members`. Each one needs:

```json
{
  "id": "unique-id",
  "name": "Full Name",
  "role": "Role or title",
  "photo": "/src/assets/placeholders/team-1.svg",
  "bio": "A sentence or two.",
  "socials": { "instagram": "#", "linkedin": "#" }
}
```

`socials` only needs the platforms that apply. Supported keys:
`instagram`, `facebook`, `youtube`, `linkedin`, `tiktok`. The team grid
adjusts automatically for 2, 3, or more people, so this isn't locked to
exactly three.

### Images

All images referenced in the JSON (logo, app preview frames, team photos)
are placeholder SVGs in `src/assets/placeholders/`. Replace the files or
point the JSON paths at real images/URLs — no component code needs to
change either way.

### Logo

`src/components/Logo.tsx` renders the image logo (`brand.wordmarkImage` +
`brand.name` as alt text). A text-only wordmark version is written but
commented out in the same file, in case the image logo isn't ready or a
lighter header is wanted later.

## The route line

The vertical line on the right edge of the page (desktop only) is the
site's one signature visual — it doubles as in-page navigation and fills
in as you scroll, echoing the app's own route-tracking. It lives in
`src/components/RouteRail.tsx`. The list of waypoints there should match
the section `id`s in `App.tsx`.

## Not done yet

- Real Google Play / direct download links
- Real team photos and bios
- Real app screenshots in place of the abstract showcase placeholders
- Deploy target / domain

# LinknRun

A marketing website for the LinknRun app.
b16ea707d34798048fe14eea602acf6a6dd6fce8
