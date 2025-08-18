import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface PlaneInstanceProps {
  direction: 'left-to-right' | 'right-to-left';
  altitude: 'top' | 'bottom';
}

function PlaneInstance({ direction, altitude }: PlaneInstanceProps) {
  const planeRef = useRef<Group>(null);
  const progressRef = useRef<number>(Math.random() * 320);
  const { scene } = useGLTF('/models/plane.gltf');

  const config = {
    'left-to-right': {
      xStart: -400,
      xEnd: 400,
      yAltitude: altitude === 'top' ? 45 : 18,
      zLane: altitude === 'top' ? 30 : -20,
      rotation: Math.PI / 2,
      speedUnitsPerSecond: 35,
    },
    'right-to-left': {
      xStart: 400,
      xEnd: -400,
      yAltitude: altitude === 'top' ? 40 : 22,
      zLane: altitude === 'top' ? 25 : -15,
      rotation: -Math.PI / 2,
      speedUnitsPerSecond: 30,
    }
  };

  const settings = config[direction];

  useFrame((state, delta) => {
    if (!planeRef.current) return;

    progressRef.current += delta * settings.speedUnitsPerSecond;
    
    const distance = Math.abs(settings.xEnd - settings.xStart);
    const wrapped = (progressRef.current % distance + distance) % distance;
    
    let x: number;
    if (direction === 'left-to-right') {
      x = settings.xStart + wrapped;
    } else {
      x = settings.xStart - wrapped;
    }

    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.5 + (altitude === 'top' ? 0 : Math.PI)) * 0.5;
    const bank = Math.sin(t * 1.0 + (direction === 'right-to-left' ? Math.PI : 0)) * 0.08;
    const drift = Math.sin(t * 0.6) * 1;

    planeRef.current.position.set(
      x, 
      settings.yAltitude + bob, 
      settings.zLane + drift
    );
    
    let finalRotation: number;
    
    if (direction === 'left-to-right') {
      finalRotation = -Math.PI / 2;
    } else {
      finalRotation = Math.PI / 2;
    }
    
    planeRef.current.rotation.set(0, finalRotation, bank);

    const targetScale = altitude === 'top' ? 0.8 : 0.6;
    const currentScale = planeRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.06;
    planeRef.current.scale.setScalar(newScale);
  });

  return (
    <group ref={planeRef}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export default function PlaneFlyover() {
  return (
    <group>
      <PlaneInstance direction="left-to-right" altitude="top" />
      
      <PlaneInstance direction="right-to-left" altitude="bottom" />
    </group>
  );
}

useGLTF.preload('/models/plane.gltf');