import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const FloatingShield = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef}>
                <octahedronGeometry args={[2, 0]} />
                <MeshDistortMaterial
                    color="#FF5E00"
                    speed={3}
                    distort={0.4}
                    radius={1}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
        </Float>
    );
};

const Rajmudra3D = () => {
    return (
        <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <FloatingShield />
            </Canvas>
        </div>
    );
};

export default Rajmudra3D;
