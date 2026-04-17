import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleCloud({ count, color, mouseRef, radius = 2.6, speed = 0.03, size = 0.022, opacity = 0.22 }) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const r = radius * (0.35 + Math.random() * 0.75);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      values[i3] = r * Math.sin(phi) * Math.cos(theta);
      values[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      values[i3 + 2] = r * Math.cos(phi) * 0.65;
    }

    return values;
  }, [count, radius]);

  useFrame((state) => {
    if (!pointsRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const targetX = mouseRef.current.x * 0.16;
    const targetY = mouseRef.current.y * 0.12;

    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.04);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetY, 0.04);
    pointsRef.current.rotation.y = elapsed * speed + mouseRef.current.x * 0.2;
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.08 + mouseRef.current.y * 0.16;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroWebGLBackground() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewportQuery = window.matchMedia("(max-width: 900px)");

    const updateFlags = () => {
      setIsReducedMotion(reducedMotionQuery.matches);
      setIsCompactViewport(compactViewportQuery.matches);
    };

    updateFlags();

    const onReducedMotionChange = () => updateFlags();
    const onCompactViewportChange = () => updateFlags();

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", onReducedMotionChange);
      compactViewportQuery.addEventListener("change", onCompactViewportChange);
    } else {
      reducedMotionQuery.addListener(onReducedMotionChange);
      compactViewportQuery.addListener(onCompactViewportChange);
    }

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
        compactViewportQuery.removeEventListener("change", onCompactViewportChange);
      } else {
        reducedMotionQuery.removeListener(onReducedMotionChange);
        compactViewportQuery.removeListener(onCompactViewportChange);
      }
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      return undefined;
    }

    function handlePointerMove(event) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -((event.clientY / window.innerHeight) * 2 - 1);
      mouseRef.current = { x, y };
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return null;
  }

  return (
    <div className={`pointer-events-none absolute inset-0 z-[3] ${isCompactViewport ? "opacity-70" : "opacity-[0.85]"}`}>
      <Canvas
        dpr={isCompactViewport ? [1, 1.2] : [1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 52 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#f8fafc", 2.4, 8.2]} />
        <ParticleCloud
          count={isCompactViewport ? 140 : 240}
          color="#2563eb"
          mouseRef={mouseRef}
          radius={isCompactViewport ? 2.4 : 2.8}
          speed={0.028}
          size={isCompactViewport ? 0.018 : 0.021}
          opacity={isCompactViewport ? 0.15 : 0.18}
        />
        <ParticleCloud
          count={isCompactViewport ? 115 : 200}
          color="#22c55e"
          mouseRef={mouseRef}
          radius={isCompactViewport ? 2.1 : 2.4}
          speed={-0.024}
          size={isCompactViewport ? 0.016 : 0.018}
          opacity={isCompactViewport ? 0.16 : 0.2}
        />
      </Canvas>
    </div>
  );
}
