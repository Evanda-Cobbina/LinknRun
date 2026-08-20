import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useTheme, type Theme } from "../hooks/useTheme";
import "./ShoeScene.css";

const MODEL_URL = "/models/sneaker.glb";

// Confirmed directly from the .glb's material list: this model only
// has two materials, both flat colors (no texture maps) — so we can
// recolor by exact name instead of guessing from RGB values.
const BLUE_MATERIAL_NAME = "Mat.3";
const WHITE_MATERIAL_NAME = "Mat.4";

const RECOLOR: Record<Theme, { blue: string; white: string }> = {
  dark: { blue: "#ff6b2c", white: "#0b0b0c" },
  light: { blue: "#181614", white: "#e8531a" },
};

// Small ref-shaped types so this file doesn't depend on a specific
// React version's ref typings (those have shifted between major
// versions) — just "an object with a mutable .current".
interface NumberRef {
  current: number;
}
interface BoolRef {
  current: boolean;
}

function shortestAngleDelta(from: number, to: number) {
  const twoPi = Math.PI * 2;
  let delta = (to - from) % twoPi;
  if (delta > Math.PI) delta -= twoPi;
  if (delta < -Math.PI) delta += twoPi;
  return delta;
}

// The raw model's geometry lives in a huge coordinate space — its
// bounding box is roughly 308 x 160 x 308 units, with no scale/offset
// baked into its nodes to compensate. Measured directly from the
// .glb's accessor min/max values. These two constants are what turn
// that into something that actually sits inside the camera's view
// instead of engulfing it:
//   MODEL_SCALE       shrinks it down to a couple of world units
//   MODEL_CENTER_OFFSET  shifts the raw geometry so its own visual
//                        center lands on the origin — otherwise it
//                        rotates around a point far outside itself
const MODEL_SCALE = 0.0072;
const MODEL_CENTER_OFFSET: [number, number, number] = [-5.89, -79.98, -5.89];

interface ShoeModelProps {
  theme: Theme;
  targetYaw: NumberRef;
  idle: BoolRef;
}

// How quickly the shoe's colors ease toward the current theme's target
// each frame — higher is faster. This value gets ~95% of the way to
// the new color in about 300ms, which reads as a deliberate, smooth
// cross-fade rather than a hard instant cut, but is still quick enough
// not to feel laggy after clicking the toggle.
const COLOR_TRANSITION_SPEED = 10;

function ShoeModel({ theme, targetYaw, idle }: ShoeModelProps) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);

  // Which material object plays which brand role ("blue" = main body,
  // "white" = trim/secondary) — built once when the model loads and
  // kept as a stable list for the per-frame transition loop below,
  // rather than re-walking the whole scene graph on every theme flip.
  const recolorTargets = useRef<
    { material: THREE.MeshStandardMaterial; role: "blue" | "white" }[]
  >([]);

  // The color each role is currently easing TOWARD. Updated the instant
  // the theme changes; the actual material colors then chase this
  // value frame by frame in useFrame, which is what turns the swap
  // into a smooth transition instead of a snap.
  const targetColor = useRef({
    blue: new THREE.Color(RECOLOR[theme].blue),
    white: new THREE.Color(RECOLOR[theme].white),
  });

  useEffect(() => {
    const found: typeof recolorTargets.current = [];

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        const standard = mat as THREE.MeshStandardMaterial;
        if (!standard.color) return;

        if (mat.name === BLUE_MATERIAL_NAME) {
          standard.color.copy(targetColor.current.blue);
          // A little metalness/reduced roughness gives the surface an
          // actual specular response — without this, a point light
          // orbiting close to the shoe has almost nothing to catch and
          // reflect, so the "shine" moving across it wouldn't read at
          // all no matter how the light itself is positioned.
          standard.metalness = 0.28;
          standard.roughness = 0.35;
          found.push({ material: standard, role: "blue" });
        } else if (mat.name === WHITE_MATERIAL_NAME) {
          standard.color.copy(targetColor.current.white);
          standard.metalness = 0.28;
          standard.roughness = 0.35;
          found.push({ material: standard, role: "white" });
        }
      });
    });

    recolorTargets.current = found;
  }, [scene]);

  // Retarget on every theme change — this only updates where the
  // colors are heading, not the materials themselves, so switching
  // themes rapidly just redirects the in-progress fade instead of
  // restarting it from a snap.
  useEffect(() => {
    const palette = RECOLOR[theme];
    targetColor.current.blue.set(palette.blue);
    targetColor.current.white.set(palette.white);
  }, [theme]);

  useFrame((_, delta) => {
    const node = group.current;
    if (node) {
      if (idle.current) {
        // Gentle constant spin when nobody's interacting.
        targetYaw.current += delta * 0.35;
      }

      // Ease toward the target via the shortest angular path, so a big
      // jump in accumulated idle rotation doesn't cause a visible spin
      // when hover/touch suddenly sets an absolute target angle.
      const diff = shortestAngleDelta(node.rotation.y, targetYaw.current);
      node.rotation.y += diff * Math.min(1, delta * 4);
    }

    // Frame-rate independent exponential approach — converges toward
    // the target at the same real-world speed regardless of the
    // current frame rate, rather than a fixed-per-frame lerp amount
    // that would transition faster on a high refresh-rate display.
    const t = 1 - Math.exp(-COLOR_TRANSITION_SPEED * delta);
    for (const { material, role } of recolorTargets.current) {
      material.color.lerp(targetColor.current[role], t);
    }
  });

  return (
    <group ref={group} scale={MODEL_SCALE}>
      <primitive object={scene} position={MODEL_CENTER_OFFSET} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

// How close the key light orbits, and how fast. The shoe's own scaled
// bounding box is roughly 2.2 units across — this radius keeps the
// light right at the surface rather than off in the distance, which is
// the whole point: a point light this close has real falloff, so it
// casts an actual bright hotspot that visibly slides across the shoe
// as it orbits, instead of the flat, barely-changing wash a distant
// directional "sun" light produces on something this small.
const KEY_LIGHT_RADIUS = 1.65;
const KEY_LIGHT_HEIGHT = 1.05;
const KEY_LIGHT_SPEED = 0.3;
const KEY_LIGHT_INTENSITY = 7;
const KEY_LIGHT_DISTANCE = 4.2;

interface LightingRigProps {
  idle: BoolRef;
}

// The key light is a point light orbiting close to the shoe's surface
// (see constants above) — that's what makes this "dynamic" in a way
// that's actually visible, rather than a distant light whose position
// barely matters. The rim light stays a soft directional accent, and
// leans harder into the brand orange and brightens the moment someone
// actually engages with the shoe (hover/touch), so the lighting itself
// reinforces the interaction rather than just running in the background.
function LightingRig({ idle }: LightingRigProps) {
  const keyLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const rimIntensity = useRef(0.35);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    if (keyLight.current) {
      keyLight.current.position.set(
        Math.sin(elapsed * KEY_LIGHT_SPEED) * KEY_LIGHT_RADIUS,
        KEY_LIGHT_HEIGHT,
        Math.cos(elapsed * KEY_LIGHT_SPEED) * KEY_LIGHT_RADIUS,
      );
    }

    if (rimLight.current) {
      const target = idle.current ? 0.35 : 0.9;
      rimIntensity.current += (target - rimIntensity.current) * Math.min(1, delta * 4);
      rimLight.current.intensity = rimIntensity.current;
    }
  });

  return (
    // Ambient kept low on purpose — the point light's hotspot is the
    // whole effect, and a bright ambient wash would flatten it back
    // out into the same "lit from everywhere, lit from nowhere" look
    // this replaced.
    <>
      <ambientLight intensity={0.3} />
      <pointLight
        ref={keyLight}
        intensity={KEY_LIGHT_INTENSITY}
        distance={KEY_LIGHT_DISTANCE}
        decay={2}
      />
      <directionalLight ref={rimLight} position={[-3, -1, -2]} intensity={0.35} color="#ff6b2c" />
    </>
  );
}

export function ShoeScene() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const targetYaw = useRef(0);
  const idle = useRef(true);
  const [hasHovered, setHasHovered] = useState(false);
  const [hasTouched, setHasTouched] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Hover (mouse/pen): the shoe's rotation directly follows the
    // cursor's horizontal position across the frame.
    function angleFromClientX(clientX: number) {
      const rect = el!.getBoundingClientRect();
      const relative = (clientX - rect.left) / rect.width; // 0 -> 1
      return (relative - 0.5) * Math.PI * 1.4;
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return; // touch handled below
      idle.current = false;
      setHasHovered(true);
      targetYaw.current = angleFromClientX(event.clientX);
    }

    function handlePointerLeave(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      idle.current = true;
    }

    // Touch: deliberately requires TWO fingers, so a normal one-finger
    // swipe still scrolls the page like everywhere else on the site.
    // Only the two-finger gesture is captured (preventDefault) so it
    // doesn't also try to scroll while spinning the shoe.
    let lastTwoFingerX: number | null = null;

    function averageTouchX(touches: TouchList) {
      return (touches[0].clientX + touches[1].clientX) / 2;
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length === 2) {
        event.preventDefault();
        idle.current = false;
        setHasTouched(true);
        lastTwoFingerX = averageTouchX(event.touches);
      }
    }

    function handleTouchMove(event: TouchEvent) {
      if (event.touches.length === 2) {
        event.preventDefault();
        const avgX = averageTouchX(event.touches);
        if (lastTwoFingerX !== null) {
          const rect = el!.getBoundingClientRect();
          const deltaX = avgX - lastTwoFingerX;
          targetYaw.current += (deltaX / rect.width) * Math.PI * 1.4;
        }
        lastTwoFingerX = avgX;
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      if (event.touches.length < 2) {
        lastTwoFingerX = null;
        idle.current = true;
      }
    }

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <div className="shoe-stage" ref={containerRef}>
      <Canvas
        className="shoe-canvas"
        dpr={[1, 2]}
        camera={{ position: [0, 0.55, 4.2], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
      >
        <LightingRig idle={idle} />
        <Suspense fallback={null}>
          <ShoeModel theme={theme} targetYaw={targetYaw} idle={idle} />
        </Suspense>
      </Canvas>

      <span
        className={`shoe-hint shoe-hint-hover ${hasHovered ? "is-dismissed" : ""}`}
      >
        Hover to explore
      </span>
      <span
        className={`shoe-hint shoe-hint-touch ${hasTouched ? "is-dismissed" : ""}`}
      >
        Use two fingers to rotate
      </span>
    </div>
  );
}
