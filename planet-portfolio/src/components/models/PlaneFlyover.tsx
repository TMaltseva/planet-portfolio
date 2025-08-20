import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import * as THREE from 'three';

interface PlaneInstanceProps {
  startX: number;
  endX: number;
  y: number;
  z: number;
  speed: number;
  scale: number;
  rotationY: number;
}

function PlaneInstance({ startX, endX, y, z, speed, scale, rotationY }: PlaneInstanceProps) {
  const planeRef = useRef<Group>(null);
  const progressRef = useRef<number>(0);
  const { scene } = useGLTF('/models/plane.gltf');

  useFrame((state, delta) => {
    if (!planeRef.current) return;
    progressRef.current += delta * speed;
    
    const totalDistance = endX - startX;
    const currentX = startX + progressRef.current;
    const bob = Math.sin(state.clock.elapsedTime * 2 + progressRef.current * 0.1) * 0.3;
    
    planeRef.current.position.set(currentX, y + bob, z);
    
    planeRef.current.rotation.set(
      Math.sin(state.clock.elapsedTime * 1.5 + progressRef.current * 0.05) * 0.01,
      rotationY,
      Math.sin(state.clock.elapsedTime * 0.8 + progressRef.current * 0.08) * 0.02
    );
    
    planeRef.current.scale.setScalar(scale);
    
    const fadeStartDistance = totalDistance * 0.8;
    
    if (progressRef.current > fadeStartDistance) {
      const fadeProgress = (progressRef.current - fadeStartDistance) / (totalDistance - fadeStartDistance);
      const opacity = Math.max(0, 1 - fadeProgress);
      
      planeRef.current.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: THREE.Material) => {
              mat.transparent = true;
              mat.opacity = opacity;
            });
          } else {
            mesh.material.transparent = true;
            mesh.material.opacity = opacity;
          }
        }
      });
      
      const sizeMultiplier = 0.5 + opacity * 0.5;
      planeRef.current.scale.setScalar(scale * sizeMultiplier);
    }
    
    if (progressRef.current >= totalDistance) {
      planeRef.current.visible = false;
    }
  });

  return (
    <group ref={planeRef}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export default function PlaneFlyover() {
  const planes = useMemo(() => [
    {
      startX: -250,
      endX: 500,
      y: 15,
      z: -25,
      speed: 20,
      scale: 1.5,
      rotationY: Math.PI,
    },
  ], []);

  return (
    <group>
      {planes.map((plane, index) => (
        <PlaneInstance
          key={index}
          startX={plane.startX}
          endX={plane.endX}
          y={plane.y}
          z={plane.z}
          speed={plane.speed}
          scale={plane.scale}
          rotationY={plane.rotationY}
        />
      ))}
    </group>
  );
}

useGLTF.preload('/models/plane.gltf');