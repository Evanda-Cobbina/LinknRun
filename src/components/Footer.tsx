import { content } from "../content";
import { Logo } from "./Logo";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Logo />
        <p className="footer-tagline">{content.footer.tagline}</p>
        <nav className="footer-links">
          {content.footer.links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#top" className="footer-top">
          Back to start ↑
        </a>
      </div>
    </footer>
  );
}
