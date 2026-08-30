'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TRAVEL_DISTANCE = 400;

interface DebrisProps {
  sectionIndex: number;
  direction: number;
  isAbove: boolean;
}

function Debris({ sectionIndex, direction, isAbove }: DebrisProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, material, initialPosition, velocity, rotationSpeed } = useMemo(() => {
    const w = Math.random() * 3.0 + 1.0;
    const h = Math.random() * 8.0 + 1.0;
    const d = Math.random() * 6.0 + 1.0;

    const geometry = new THREE.BoxGeometry(w, h, d);

    const material = isAbove
      ? new THREE.MeshPhongMaterial({
          color: 0xeeeeee,
          shininess: 100,
          emissive: 0x222222,
        })
      : new THREE.MeshPhongMaterial({
          color: 0xdddddd,
          shininess: 80,
          emissive: 0x111111,
        });

    const sectionYOffset = -(sectionIndex - 1) * 100;
    const startX = direction > 0
      ? -TRAVEL_DISTANCE / 2 - Math.random() * TRAVEL_DISTANCE
      : TRAVEL_DISTANCE / 2 + Math.random() * TRAVEL_DISTANCE;

    const centralBias = (Math.random() - Math.random()) * 0.5;
    const yPosition = sectionYOffset + Math.pow(Math.random() * 2 - 1, 1.5) * 50 * centralBias;
    const zPosition = Math.random() * 80 - 40;

    const initialPosition = new THREE.Vector3(startX, yPosition, zPosition);

    const velocity = (Math.random() * 0.35 + 0.15) * direction;

    const rotationSpeed = {
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.005,
    };

    return { geometry, material, initialPosition, velocity, rotationSpeed };
  }, [sectionIndex, direction, isAbove]);

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.position.x += velocity;
    meshRef.current.rotation.x += rotationSpeed.x;
    meshRef.current.rotation.y += rotationSpeed.y;
    meshRef.current.rotation.z += rotationSpeed.z;

    if (direction > 0 && meshRef.current.position.x > TRAVEL_DISTANCE / 2) {
      resetPosition();
    } else if (direction < 0 && meshRef.current.position.x < -TRAVEL_DISTANCE / 2) {
      resetPosition();
    }
  });

  const resetPosition = () => {
    if (!meshRef.current) return;

    const sectionYOffset = -(sectionIndex - 1) * 100;
    const centralBias = (Math.random() - Math.random()) * 0.5;
    const yPosition = sectionYOffset + Math.pow(Math.random() * 2 - 1, 1.5) * 50 * centralBias;

    meshRef.current.position.x = direction > 0
      ? -TRAVEL_DISTANCE / 2 - 50
      : TRAVEL_DISTANCE / 2 + 50;
    meshRef.current.position.y = yPosition;
    meshRef.current.position.z = Math.random() * 80 - 40;

    meshRef.current.rotation.x = Math.random() * Math.PI * 2;
    meshRef.current.rotation.y = Math.random() * Math.PI * 2;
    meshRef.current.rotation.z = Math.random() * Math.PI * 2;
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={initialPosition}
      castShadow={isAbove}
      receiveShadow={!isAbove}
    />
  );
}

function DebrisField() {
  const debris = useMemo(() => {
    const items: Array<{
      sectionIndex: number;
      direction: number;
      isAbove: boolean;
      key: string;
    }> = [];

    for (let section = 1; section <= 3; section++) {
      const direction = section % 2 === 1 ? 1 : -1;
      const numAbove = Math.floor(Math.random() * 6) + 5;
      const numBelow = Math.floor(Math.random() * 6) + 20;

      for (let i = 0; i < numAbove; i++) {
        items.push({
          sectionIndex: section,
          direction,
          isAbove: true,
          key: `above-${section}-${i}`,
        });
      }

      for (let i = 0; i < numBelow; i++) {
        items.push({
          sectionIndex: section,
          direction,
          isAbove: false,
          key: `below-${section}-${i}`,
        });
      }
    }

    return items;
  }, []);

  return (
    <>
      {debris.map((item) => (
        <Debris
          key={item.key}
          sectionIndex={item.sectionIndex}
          direction={item.direction}
          isAbove={item.isAbove}
        />
      ))}
    </>
  );
}

function Lights({ isAbove }: { isAbove: boolean }) {
  if (isAbove) {
    return (
      <>
        <ambientLight intensity={0.8} />
        <pointLight
          position={[0, 0, 50]}
          intensity={2}
          distance={500}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 0, 50]} intensity={1.5} distance={500} />
    </>
  );
}

interface DebrisSceneProps {
  scrollY?: number;
}

export default function DebrisScene({ scrollY = 0 }: DebrisSceneProps) {
  const cameraY = -scrollY * 0.05;

  return (
    <>
      {/* Below layer */}
      <div className="fixed inset-0 z-[5] pointer-events-none">
        <Canvas
          camera={{
            position: [0, cameraY, 100],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          gl={{ alpha: true, antialias: true }}
          shadows={false}
        >
          <Lights isAbove={false} />
          <DebrisField />
          <CameraController scrollY={scrollY} />
        </Canvas>
      </div>

      {/* Above layer */}
      <div className="fixed inset-0 z-[25] pointer-events-none">
        <Canvas
          camera={{
            position: [0, cameraY, 100],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          gl={{ alpha: true, antialias: true }}
          shadows
        >
          <Lights isAbove={true} />
          <DebrisField />
          <CameraController scrollY={scrollY} />
        </Canvas>
      </div>
    </>
  );
}

function CameraController({ scrollY }: { scrollY: number }) {
  useFrame(({ camera }) => {
    const targetY = -scrollY * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.1;
    camera.lookAt(0, camera.position.y, 0);
  });

  return null;
}
