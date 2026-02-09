import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ShivajiSilhouette = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Subtle breathing animation
    groupRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });

  // Create silhouette using simple shapes
  return (
    <group ref={groupRef} position={[2.5, -1.5, 1]}>
      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 1.8, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>
      {/* Crown/Turban */}
      <mesh position={[0, 2.55, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.28, 0.3, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} metalness={0} />
      </mesh>
      {/* Sword */}
      <mesh position={[0.4, 1, 0.1]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.04, 1.2, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

export default ShivajiSilhouette;
