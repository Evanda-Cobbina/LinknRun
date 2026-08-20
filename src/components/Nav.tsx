import { useEffect, useState } from "react";
import { content } from "../content";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import "./Nav.css";

export function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${solid ? "nav-solid" : ""}`}>
      <div className="nav-inner">
        <Logo />
        <nav className="nav-links">
          {content.nav.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#download" className="btn btn-primary nav-cta">
          {content.nav.ctaLabel}
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
