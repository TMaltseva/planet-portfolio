import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import type { CloudInstanceProps } from '../../types';

export default function CloudInstance({ position, scale, rotationSpeed, floatSpeed }: CloudInstanceProps) {
  const cloudRef = useRef<Group>(null);
  const { scene } = useGLTF('/models/cloud.gltf');

  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * 2;
      cloudRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * floatSpeed * 0.5) * 1;
      
      cloudRef.current.rotation.y += rotationSpeed;
      cloudRef.current.rotation.z += rotationSpeed * 0.3;
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <primitive object={scene.clone()} scale={scale} />
    </group>
  );
}

useGLTF.preload('/models/cloud.gltf');
