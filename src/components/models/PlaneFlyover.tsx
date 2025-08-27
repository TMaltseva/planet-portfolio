import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import * as THREE from 'three';
import { useModalContext } from '../../contexts/ModalContext';

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
  const { scene } = useGLTF('models/plane.gltf');
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const tintAppliedRef = useRef<boolean>(false);
  const { showModal } = useModalContext();

  useFrame((state, delta) => {
    if (showModal) return;
    
    if (!planeRef.current) return;

    if (!tintAppliedRef.current) {
      const pink = new THREE.Color('#ff6ea8');
      planeRef.current.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material as THREE.Material];
          mats.forEach((mat) => {
            const m = mat as THREE.MeshStandardMaterial;
            if (m && (m as any).color) {
              m.color = (m.color as THREE.Color).clone().lerp(pink, 0.25);
              if ('emissive' in m) {
                (m.emissive as THREE.Color).lerp(pink, 0.3);
                m.emissiveIntensity = 0.1;
              }
            }
          });
        }
      });
      tintAppliedRef.current = true;
    }
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
      <mesh position={[0, -0.2, -1]} renderOrder={-1}>
        <circleGeometry args={[1.6, 32]} />
        <meshBasicMaterial ref={glowMatRef} color={'#ff6ea8'} transparent opacity={0.22} depthWrite={false} />
      </mesh>

      <pointLight color={0xff6ea8} intensity={1.2} distance={50} decay={2} position={[0.8, 0.3, -0.8]} />

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