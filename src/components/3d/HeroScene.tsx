import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import FortScene from "./FortScene";
import SaffronFlag from "./SaffronFlag";
import AmbedkarSilhouette from "./AmbedkarSilhouette";

const HeroScene = () => {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [6, 3, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.15} color="#ffedd5" />
          <directionalLight
            position={[5, 8, 3]}
            intensity={1.2}
            color="#FF7A00"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-3, 4, 2]} intensity={0.5} color="#D4AF37" />
          <pointLight position={[3, 1, 5]} intensity={0.3} color="#FF4500" />

          {/* Fog */}
          <fog attach="fog" args={["#0B0B0F", 8, 25]} />

          {/* Scene */}
          <FortScene />
          <SaffronFlag />
          <AmbedkarSilhouette />

          {/* Stars */}
          <Stars radius={50} depth={50} count={1000} factor={3} saturation={0} fade speed={0.5} />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
