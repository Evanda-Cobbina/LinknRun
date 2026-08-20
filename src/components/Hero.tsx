import { content } from "../content";
import { CursorRings } from "./CursorRings";
import "./Hero.css";

export function Hero() {
  return (
    <section id="top" className="hero">
      <CursorRings />

      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.headline}</h1>
          <p className="hero-sub">{content.hero.subhead}</p>
          <div className="hero-actions">
            <a href="#download" className="btn btn-primary">
              {content.hero.primaryCtaLabel}
            </a>
            <a href="#about" className="btn btn-ghost">
              {content.hero.secondaryCtaLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="hero-fade" />
    </section>
  );
}
