import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AmbedkarSilhouette = () => {
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
      {/* Glasses */}
      <mesh position={[0.12, 2.35, 0.2]} castShadow>
        <torusGeometry args={[0.06, 0.01, 8, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.12, 2.35, 0.2]} castShadow>
        <torusGeometry args={[0.06, 0.01, 8, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Book */}
      <mesh position={[0.3, 1.3, 0.2]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
};

export default AmbedkarSilhouette;
