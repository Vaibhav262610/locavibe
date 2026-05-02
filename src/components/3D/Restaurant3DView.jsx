import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Environment, ContactShadows } from '@react-three/drei';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Restaurant3DModel = ({ restaurant, isHovered }) => {
  const meshRef = useRef();
  const [texture] = useLoader(TextureLoader, [restaurant.image || '/placeholder-restaurant.jpg']);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group>
      {/* Main building */}
      <Box
        ref={meshRef}
        args={[2, 3, 2]}
        position={[0, 1.5, 0]}
        scale={isHovered ? 1.1 : 1}
      >
        <meshStandardMaterial 
          map={texture} 
          roughness={0.3}
          metalness={0.1}
        />
      </Box>

      {/* Roof */}
      <Box
        args={[2.2, 0.2, 2.2]}
        position={[0, 3.1, 0]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Rating stars floating above */}
      {Array.from({ length: Math.floor(restaurant.rating || 5) }, (_, i) => (
        <Sphere
          key={i}
          args={[0.05]}
          position={[-1 + i * 0.5, 4 + Math.sin(Date.now() * 0.001 + i) * 0.2, 0]}
        >
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700"
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}

      {/* Restaurant name */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.3}
        color="#33e0a1"
        anchorX="center"
        anchorY="middle"
        font="/fonts/bricolage-grotesque.woff"
      >
        {restaurant.name}
      </Text>

      {/* Cuisine type */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.15}
        color="#D0D0D0"
        anchorX="center"
        anchorY="middle"
      >
        {restaurant.cuisine}
      </Text>
    </group>
  );
};

const Restaurant3DView = ({ restaurant, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-[#121b22] to-[#1a2332] ${className}`}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#33e0a1" />

          {/* Environment */}
          <Environment preset="city" />

          {/* 3D Model */}
          <Restaurant3DModel restaurant={restaurant} isHovered={isHovered} />

          {/* Ground */}
          <ContactShadows
            position={[0, -0.1, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-sm rounded-xl p-3">
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="font-semibold text-sm">{restaurant.name}</h3>
            <p className="text-xs opacity-70">{restaurant.cuisine}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm">{restaurant.rating}</span>
            </div>
            <p className="text-xs opacity-70">{restaurant.reviewCount} reviews</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Restaurant3DView;