import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import type { LocationMarkerProps } from '../../types';

interface LocationFigureProps extends LocationMarkerProps {
  onClick: () => void;
}

export default function LocationFigure({ 
  point, 
  isActive, 
  onClick 
}: LocationFigureProps) {
  const figureRef = useRef<Group>(null);
  const { scene } = useGLTF('/models/location.gltf');

  useFrame((state) => {
    if (figureRef.current) {
      const baseY = point.position[1];
      const amplitude = 0.3;
      const speed = isActive ? 2 : 1.5;
      
      figureRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed) * amplitude;
      
      figureRef.current.rotation.y += 0.005;
      
      const targetScale = isActive ? 1.3 : 1.0;
      const currentScale = figureRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      figureRef.current.scale.setScalar(newScale);
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <group 
      ref={figureRef} 
      position={point.position}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <primitive 
        object={scene.clone()} 
        scale={1.0}
      />
      
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.8, 16]} />
        <meshBasicMaterial 
          color={point.color} 
          transparent 
          opacity={isActive ? 0.6 : 0.3}
        />
      </mesh>
      
      {isActive && (
        <pointLight 
          position={[0, 2, 0]} 
          intensity={1.5} 
          color={point.color} 
          distance={8} 
        />
      )}
    </group>
  );
}

useGLTF.preload('/models/location.gltf');

