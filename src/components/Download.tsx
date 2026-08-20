import { useRef } from "react";
import { content } from "../content";
import { useSectionProgress } from "../hooks/useSectionProgress";
import { ShoeScene } from "./ShoeScene";
import "./Download.css";

// Where each callout's line anchors on the frame, as a percentage of
// the shoe frame's own box — one per corner, cycling if there are
// ever more than 4 highlights.
const STOPS = [
  { x: 18, y: 22 },
  { x: 82, y: 22 },
  { x: 18, y: 80 },
  { x: 82, y: 80 },
];

// Splits the section's overall scroll progress (0 to 1) into equal
// slices, one per highlight, and returns how far through ITS OWN
// slice a given highlight is.
function stopLocalProgress(progress: number, index: number, total: number) {
  const start = index / total;
  const end = (index + 1) / total;
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

// Fades a callout in over the first quarter of its slice, holds it
// fully visible, then fades it out over the last quarter.
function stopOpacity(local: number) {
  const fadeIn = Math.min(1, local / 0.25);
  const fadeOut = 1 - Math.min(1, Math.max(0, (local - 0.75) / 0.25));
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

export function Download() {
  const { download } = content;
  const { links, highlights } = download;
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useSectionProgress(trackRef);

  return (
    <section id="download" className="section get-moving">
      <div className="get-moving-track" ref={trackRef}>
        <div className="get-moving-sticky">
          <div className="get-moving-stage">
            <div className="get-moving-copy">
              <span className="eyebrow">{download.eyebrow}</span>
              <h2>{download.headline}</h2>
              <p>{download.body}</p>

              <div className="download-actions">
                <a
                  href={links.googlePlayUrl}
                  className={`btn btn-primary ${links.googlePlayLive ? "" : "btn-disabled"}`}
                  aria-disabled={!links.googlePlayLive}
                >
                  Get it on Google Play
                </a>
                <a
                  href={links.directDownloadUrl}
                  className={`btn btn-ghost ${links.directDownloadLive ? "" : "btn-disabled"}`}
                  aria-disabled={!links.directDownloadLive}
                >
                  Direct download
                </a>
              </div>

              {(!links.googlePlayLive || !links.directDownloadLive) && (
                <p className="download-note">
                  Links go live the moment the app is published.
                </p>
              )}
            </div>

            <div className="get-moving-shoe-frame">
              <div className="get-moving-shoe-visual">
                <ShoeScene />
              </div>

              <div className="get-moving-callouts">
                <svg
                  className="callout-lines"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {highlights.map((highlight, index) => {
                    const stop = STOPS[index % STOPS.length];
                    const local = stopLocalProgress(progress, index, highlights.length);
                    const draw = Math.min(1, local / 0.3);
                    return (
                      <line
                        key={highlight.id}
                        x1={stop.x}
                        y1={stop.y}
                        x2={50}
                        y2={58}
                        pathLength={1}
                        style={{
                          strokeDasharray: 1,
                          strokeDashoffset: 1 - draw,
                          opacity: stopOpacity(local),
                        }}
                      />
                    );
                  })}
                </svg>

                {highlights.map((highlight, index) => {
                  const stop = STOPS[index % STOPS.length];
                  const local = stopLocalProgress(progress, index, highlights.length);
                  return (
                    <div
                      key={highlight.id}
                      className="callout-label"
                      style={{
                        left: `${stop.x}%`,
                        top: `${stop.y}%`,
                        opacity: stopOpacity(local),
                      }}
                    >
                      <span className="callout-label-title">{highlight.label}</span>
                      <span className="callout-label-body">{highlight.body}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
