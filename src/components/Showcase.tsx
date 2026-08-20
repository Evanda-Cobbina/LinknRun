import { content } from "../content";
import "./Showcase.css";

export function Showcase() {
  const { showcase } = content;

  return (
    <section id="showcase" className="section showcase">
      <div className="section-head">
        <span className="eyebrow">{showcase.eyebrow}</span>
        <h2>{showcase.headline}</h2>
        <p>{showcase.body}</p>
      </div>

      <div className="showcase-strip">
        {showcase.frames.map((frame) => (
          <figure className="showcase-frame" key={frame.id}>
            <img src={frame.image} alt="" />
            <figcaption>{frame.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
