import type { ComponentType } from "react";
import { content } from "../content";
import "./Network.css";

/*
  These three illustrations are inline SVG (not files loaded via <img>)
  specifically so they can use var(--color-*) directly, the same way
  every other component does. That means they theme correctly for free
  when light mode is toggled — no separate light/dark SVG files needed.
*/

function MapIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="198" height="158" rx="16" fill="var(--color-panel)" stroke="var(--color-line)" />
      {[...Array(6)].map((_, row) =>
        [...Array(8)].map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={20 + col * 23}
            cy={20 + row * 23}
            r="1.4"
            fill="var(--color-line)"
          />
        ))
      )}
      <line x1="100" y1="80" x2="46" y2="38" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="3 5" />
      <line x1="100" y1="80" x2="158" y2="46" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="3 5" />
      <line x1="100" y1="80" x2="70" y2="128" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="3 5" />
      <circle cx="46" cy="38" r="7" fill="var(--color-panel-alt)" stroke="var(--color-ash-dim)" />
      <circle cx="158" cy="46" r="7" fill="var(--color-panel-alt)" stroke="var(--color-ash-dim)" />
      <circle cx="70" cy="128" r="7" fill="var(--color-panel-alt)" stroke="var(--color-ash-dim)" />
      <circle cx="100" cy="80" r="10" fill="var(--color-signal)" />
      <circle cx="100" cy="80" r="16" fill="none" stroke="var(--color-signal)" strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}

function ChatIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="198" height="158" rx="16" fill="var(--color-panel)" stroke="var(--color-line)" />
      <rect x="20" y="30" width="110" height="34" rx="12" fill="var(--color-panel-alt)" />
      <rect x="34" y="41" width="60" height="6" rx="3" fill="var(--color-ash-dim)" />
      <rect x="34" y="52" width="38" height="6" rx="3" fill="var(--color-ash-dim)" opacity="0.6" />

      <rect x="70" y="76" width="110" height="34" rx="12" fill="var(--color-signal)" />
      <rect x="84" y="87" width="50" height="6" rx="3" fill="var(--color-void)" opacity="0.85" />
      <rect x="84" y="98" width="70" height="6" rx="3" fill="var(--color-void)" opacity="0.6" />

      <circle cx="30" cy="128" r="3" fill="var(--color-ash)" />
      <circle cx="42" cy="128" r="3" fill="var(--color-ash)" opacity="0.7" />
      <circle cx="54" cy="128" r="3" fill="var(--color-ash)" opacity="0.4" />
    </svg>
  );
}

function AddFriendIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="198" height="158" rx="16" fill="var(--color-panel)" stroke="var(--color-line)" />
      <circle cx="90" cy="70" r="34" fill="none" stroke="var(--color-line)" strokeWidth="1.5" strokeDasharray="3 6" />
      <circle cx="90" cy="60" r="14" fill="var(--color-panel-alt)" stroke="var(--color-ash-dim)" strokeWidth="1.5" />
      <path
        d="M64 108c4-14 15-22 26-22s22 8 26 22"
        stroke="var(--color-ash-dim)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="140" cy="100" r="18" fill="var(--color-signal)" />
      <line x1="140" y1="92" x2="140" y2="108" stroke="var(--color-void)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="132" y1="100" x2="148" y2="100" stroke="var(--color-void)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<string, ComponentType> = {
  map: MapIllustration,
  chat: ChatIllustration,
  addFriend: AddFriendIllustration,
};

export function Network() {
  const { network } = content;

  return (
    <section id="network" className="section network">
      <div className="section-head">
        <span className="eyebrow">{network.eyebrow}</span>
        <h2>{network.headline}</h2>
        <p>{network.body}</p>
      </div>

      <div className="network-grid">
        {network.features.map((feature) => {
          const Illustration = ILLUSTRATIONS[feature.id];
          return (
            <div className="network-card" key={feature.id}>
              <div className="network-illustration">
                <Illustration />
              </div>
              <h3>{feature.headline}</h3>
              <p>{feature.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
