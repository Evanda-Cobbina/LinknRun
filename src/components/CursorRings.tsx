import { useEffect, useRef } from "react";
import "./CursorRings.css";

// Pool size caps how many rings can be alive at once. Fixed pool,
// recycled forever — no per-frame allocation no matter how long the
// cursor keeps moving.
const POOL_SIZE = 70;

// A new ring is born somewhere within this radius of the cursor, not
// exactly on top of it. Widened from the first pass — the tighter
// radius was reading as a single dense clump rather than a scattered
// trail.
const SPAWN_JITTER = 72;

// How often a new ring is allowed to spawn, in seconds. Raised
// alongside the jitter increase so rings have room to spread out
// before the next batch arrives, instead of stacking on top of
// each other.
const SPAWN_INTERVAL = 0.075;

// Ring lifetime, in seconds — how long a ring lives from birth to fully
// dissolved. This, combined with its drift speed, is what makes rings
// naturally end up far from the cursor and fade out around the same
// time, which is the "not close to the cursor anymore, so it disappears"
// behavior being asked for.
const LIFESPAN_MIN = 1.4;
const LIFESPAN_MAX = 2.6;

const OUTER_RADIUS = 5;
const INNER_RADIUS = 3;

// How far the cursor's influence reaches for the orange fill, in pixels.
const INFLUENCE_RADIUS = 170;
const FILL_EASE = 0.15;

// Liquid drift tuning: a small constant outward push plus continuous
// random turbulence, damped each frame so motion stays gentle and
// floaty rather than shooting particles off-screen.
const DRIFT_SPEED = 18;
const TURBULENCE = 40;
const DAMPING = 0.985;

interface Ring {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  lifespan: number;
  alive: boolean;
  fill: number; // eased toward a cursor-distance target each frame
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function createPool(): Ring[] {
  return Array.from({ length: POOL_SIZE }, () => ({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    age: 0,
    lifespan: 1,
    alive: false,
    fill: 0,
  }));
}

/**
 * Reads a CSS custom property's hex value off :root and returns it as
 * "r, g, b" for use inside an rgba() string. Read live from the
 * stylesheet rather than hardcoded, so this automatically follows
 * whatever variables.css defines — including a future light-mode
 * override of --color-ash / --color-signal — with no changes needed
 * here when that lands.
 */
function readRgb(variableName: string, fallback: string): string {
  const hex = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex || fallback
  );
  if (!match) return fallback;
  const [, r, g, b] = match;
  return `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`;
}

export function CursorRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // A floating, dissolving particle trail is motion by definition —
    // there's no meaningful static equivalent, so this effect simply
    // doesn't render anything when reduced motion is requested.
    if (prefersReducedMotion) return;

    const pool = createPool();
    // The parent element (Hero — see Hero.tsx) defines the bounds this
    // effect lives in: how big the canvas is, and which pointer moves
    // count. This is what makes the rings Hero-only instead of
    // following the cursor across the whole page.
    const container = canvas.parentElement;
    if (!container) return;

    let width = 0;
    let height = 0;

    const pointer = { x: -9999, y: -9999, active: false };
    let lastTime = performance.now();
    let spawnClock = 0;

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function handlePointerMove(event: PointerEvent) {
      // Convert from page coordinates to "relative to the Hero
      // section" coordinates, since that's the space the canvas and
      // every ring's x/y live in now.
      const rect = container!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    function spawnRing() {
      const dead = pool.find((ring) => !ring.alive);
      if (!dead) return;

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * SPAWN_JITTER;
      const driftAngle = Math.random() * Math.PI * 2;

      dead.x = pointer.x + Math.cos(angle) * radius;
      dead.y = pointer.y + Math.sin(angle) * radius;
      dead.vx = Math.cos(driftAngle) * DRIFT_SPEED;
      dead.vy = Math.sin(driftAngle) * DRIFT_SPEED;
      dead.age = 0;
      dead.lifespan =
        LIFESPAN_MIN + Math.random() * (LIFESPAN_MAX - LIFESPAN_MIN);
      dead.alive = true;
      dead.fill = 0;
    }

    function step(delta: number) {
      if (pointer.active) {
        spawnClock += delta;
        while (spawnClock > SPAWN_INTERVAL) {
          spawnClock -= SPAWN_INTERVAL;
          spawnRing();
        }
      }

      for (const ring of pool) {
        if (!ring.alive) continue;

        ring.age += delta;
        if (ring.age >= ring.lifespan) {
          ring.alive = false;
          continue;
        }

        ring.vx += (Math.random() - 0.5) * TURBULENCE * delta;
        ring.vy += (Math.random() - 0.5) * TURBULENCE * delta;
        ring.vx *= DAMPING;
        ring.vy *= DAMPING;
        ring.x += ring.vx * delta;
        ring.y += ring.vy * delta;

        const dx = ring.x - pointer.x;
        const dy = ring.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const target = pointer.active
          ? 1 - smoothstep(0, INFLUENCE_RADIUS, distance)
          : 0;
        ring.fill += (target - ring.fill) * FILL_EASE;
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      const ringRgb = readRgb("--color-ash", "154, 154, 158");
      const fillRgb = readRgb("--color-signal", "255, 107, 44");

      for (const ring of pool) {
        if (!ring.alive) continue;

        const lifeT = ring.age / ring.lifespan;
        const fadeIn = smoothstep(0, 0.18, lifeT);
        const fadeOut = 1 - smoothstep(0.7, 1, lifeT);
        const opacity = fadeIn * fadeOut;
        const scale = 1 + ring.fill * 0.3;

        ctx!.beginPath();
        ctx!.arc(ring.x, ring.y, OUTER_RADIUS * scale, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${ringRgb}, ${
          (0.4 + ring.fill * 0.3) * opacity
        })`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        if (ring.fill > 0.01) {
          ctx!.beginPath();
          ctx!.arc(
            ring.x,
            ring.y,
            INNER_RADIUS * scale * ring.fill,
            0,
            Math.PI * 2
          );
          ctx!.fillStyle = `rgba(${fillRgb}, ${ring.fill * opacity})`;
          ctx!.shadowColor = `rgba(${fillRgb}, 0.8)`;
          ctx!.shadowBlur = 8 * ring.fill * opacity;
          ctx!.fill();
          ctx!.shadowBlur = 0;
        }
      }
    }

    let frame: number;
    function loop(time: number) {
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      step(delta);
      draw();
      frame = requestAnimationFrame(loop);
    }

    resize();
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-rings" aria-hidden="true" />;
}
