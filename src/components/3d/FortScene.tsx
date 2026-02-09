import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FortScene = () => {
  const fortRef = useRef<THREE.Group>(null);

  // Procedural fort geometry
  const fortParts = useMemo(() => {
    const parts: { position: [number, number, number]; scale: [number, number, number]; color: string }[] = [];

    // Main wall
    parts.push({ position: [0, 1, 0], scale: [6, 2, 0.4], color: "#3a2f1f" });
    // Left tower
    parts.push({ position: [-3.2, 1.8, 0], scale: [1, 3.6, 1], color: "#2e2416" });
    // Right tower
    parts.push({ position: [3.2, 1.8, 0], scale: [1, 3.6, 1], color: "#2e2416" });
    // Center tower (taller)
    parts.push({ position: [0, 2.5, 0.3], scale: [1.2, 5, 1.2], color: "#352a1c" });
    // Battlements
    for (let i = -2.5; i <= 2.5; i += 0.8) {
      parts.push({ position: [i, 2.2, 0.1], scale: [0.3, 0.5, 0.5], color: "#3a2f1f" });
    }
    // Gate
    parts.push({ position: [0, 0.6, 0.3], scale: [1.2, 1.2, 0.3], color: "#1a1510" });

    return parts;
  }, []);

  return (
    <group ref={fortRef} position={[0, -1.5, 0]}>
      {fortParts.map((part, i) => (
        <mesh key={i} position={part.position} castShadow receiveShadow>
          <boxGeometry args={part.scale} />
          <meshStandardMaterial color={part.color} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
      {/* Terrain */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a0f" roughness={1} />
      </mesh>
    </group>
  );
};

export default FortScene;
