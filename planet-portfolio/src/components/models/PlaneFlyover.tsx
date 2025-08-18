import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

export default function PlaneFlyover() {
  const planeRef = useRef<Group>(null);
  const progressRef = useRef<number>(0);
  const { scene } = useGLTF('/models/plane.gltf');

  const xStart = -160;
  const xEnd = 160;
  const yAltitude = 85;
  const zLane = 0;
  const speedUnitsPerSecond = 25;

  useFrame((state, delta) => {
    if (!planeRef.current) return;

    progressRef.current += delta * speedUnitsPerSecond;
    const distance = xEnd - xStart;
    const wrapped = (progressRef.current % distance + distance) % distance;
    const x = xStart + wrapped;

    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.8) * 1.2;
    const bank = Math.sin(t * 1.2) * 0.12;

    planeRef.current.position.set(x, yAltitude + bob, zLane);
    planeRef.current.rotation.set(0, Math.PI / 2, bank);

    const targetScale = 2.2;
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

useGLTF.preload('/models/plane.gltf'); 