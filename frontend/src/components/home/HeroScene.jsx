import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function generateParticlePositions(amount) {
  const positions = new Float32Array(amount * 3);

  for (let i = 0; i < amount; i += 1) {
    const t = i / amount;
    const theta = 2 * Math.PI * t * 13;
    const phi = Math.acos(1 - 2 * t);
    const radius = 2.35 + ((i % 19) / 19) * 1.65;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return positions;
}

function WireSphere() {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.y += delta * 0.22;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      state.pointer.y * 0.25,
      0.05,
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      state.pointer.x * 0.2,
      0.05,
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.45} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.45, 3]} />
        <meshStandardMaterial
          color="#bfbfbf"
          wireframe
          roughness={0.2}
          metalness={0.75}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const pointsRef = useRef(null);
  const sphere = useMemo(() => generateParticlePositions(1400), []);

  useFrame((_, delta) => {
    if (!pointsRef.current) {
      return;
    }
    pointsRef.current.rotation.y += delta * 0.04;
    pointsRef.current.rotation.x += delta * 0.015;
  });

  return (
    <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#A1A1AA"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-black/10 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,0.15),transparent_60%)] lg:h-[520px]">
      <Canvas camera={{ position: [0, 0, 5.4], fov: 48 }}>
        <color attach="background" args={["#f3f7ff"]} />
        <fog attach="fog" args={["#f3f7ff", 5, 10]} />

        <ambientLight intensity={0.9} />
        <pointLight intensity={1.6} position={[2, 3, 4]} color="#93c5fd" />
        <pointLight intensity={1} position={[-2, -2, 3]} color="#bfdbfe" />

        <Particles />
        <WireSphere />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-bg-primary to-transparent" />
    </div>
  );
}
