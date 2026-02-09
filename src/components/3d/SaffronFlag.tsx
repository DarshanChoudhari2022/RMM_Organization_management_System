import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SaffronFlag = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.5, 1, 20, 12);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const positions = meshRef.current.geometry.attributes.position;
    const time = timeRef.current;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // Wave effect increases with distance from pole
      const wave = Math.sin(x * 3 + time * 2.5) * 0.08 * (x + 0.75);
      const wave2 = Math.cos(y * 4 + time * 3) * 0.03 * (x + 0.75);
      positions.setZ(i, wave + wave2);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <group position={[0.3, 2.8, 0.3]}>
      {/* Pole */}
      <mesh position={[-0.75, -0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
        <meshStandardMaterial color="#8B7355" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Flag cloth */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#FF7A00"
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
          emissive="#FF4500"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
};

export default SaffronFlag;
