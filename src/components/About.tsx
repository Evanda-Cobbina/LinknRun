import { content } from "../content";
import "./About.css";

export function About() {
  return (
    <section id="about" className="section about">
      <div className="section-head">
        <span className="eyebrow">What LinknRun does</span>
        <h2>Made for running with other people</h2>
        <p>
          LinknRun is a jogging app built around the run you'd actually want to
          have. Nearby partners, real tracking, and a streak worth protecting.
        </p>
      </div>

      <div className="about-grid">
        {content.valueProps.map((prop) => (
          <div className="about-card" key={prop.id}>
            <span className="tag">{prop.label}</span>
            <h3>{prop.headline}</h3>
            <p>{prop.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
