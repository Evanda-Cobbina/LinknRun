import { content } from "../content";
import "./Logo.css";

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label={`${content.brand.name} home`}>
      <img src={content.brand.wordmarkImage} alt="" width={28} height={28} />
      <span className="logo-word">{content.brand.name}</span>

      {/*
        Text-only wordmark fallback.
        Swap in if the image logo isn't ready, or drop the <img>
        above and use this instead for a lighter-weight header.

        <span className="logo-text-mark">{content.brand.name}</span>
      */}
    </a>
  );
}
