import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Mesh, MeshStandardMaterial, MeshBasicMaterial, Vector3 } from 'three';
import type { CloudInstanceProps } from '../../types';
import { useModalContext } from '../../contexts/ModalContext';

export default function CloudInstance({ position, scale, rotationSpeed, floatSpeed }: CloudInstanceProps) {
  const cloudRef = useRef<Group>(null);
  const { scene } = useGLTF('models/cloud.gltf');
  const { camera } = useThree();
  const { showModal } = useModalContext();

  useEffect(() => {
    if (cloudRef.current) {
      cloudRef.current.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh;
          
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(mat => {
              const clonedMat = mat.clone();
              if (clonedMat instanceof MeshStandardMaterial || clonedMat instanceof MeshBasicMaterial) {
                clonedMat.color.setRGB(1.0, 0.7, 0.85);
                clonedMat.transparent = true;
                clonedMat.opacity = 0.8;
              }
              return clonedMat;
            });
          } else {
            const clonedMaterial = mesh.material.clone();
            if (clonedMaterial instanceof MeshStandardMaterial || clonedMaterial instanceof MeshBasicMaterial) {
              clonedMaterial.color.setRGB(1.0, 0.7, 0.85);
              clonedMaterial.transparent = true;
              clonedMaterial.opacity = 0.8;
            }
            mesh.material = clonedMaterial;
          }
        }
      });
    }
  }, []);

  useFrame((state) => {
    if (showModal) return;
    
    if (cloudRef.current) {
      cloudRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * 2;
      cloudRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * floatSpeed * 0.5) * 1;
      
      cloudRef.current.rotation.y += rotationSpeed;
      cloudRef.current.rotation.z += rotationSpeed * 0.3;

      const worldPosition = new Vector3();
      cloudRef.current.getWorldPosition(worldPosition);
      
      const screenPosition = worldPosition.clone();
      screenPosition.project(camera);
      
      const isInLeftPart = screenPosition.x < 0;
      
      if (isInLeftPart) {
        cloudRef.current.traverse((child) => {
          if ((child as Mesh).isMesh && (child as Mesh).material) {
            const mesh = child as Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                if (mat instanceof MeshStandardMaterial) {
                  mat.opacity = 0.6;
                  mat.roughness = 1.0;
                } else if (mat instanceof MeshBasicMaterial) {
                  mat.opacity = 0.6;
                }
              });
            } else {
              const material = mesh.material;
              if (material instanceof MeshStandardMaterial) {
                material.opacity = 0.6;
                material.roughness = 1.0;
              } else if (material instanceof MeshBasicMaterial) {
                material.opacity = 0.6;
              }
            }
          }
        });
      } else {
        cloudRef.current.traverse((child) => {
          if ((child as Mesh).isMesh && (child as Mesh).material) {
            const mesh = child as Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                if (mat instanceof MeshStandardMaterial) {
                  mat.opacity = 0.8;
                  mat.roughness = 0.5;
                } else if (mat instanceof MeshBasicMaterial) {
                  mat.opacity = 0.8;
                }
              });
            } else {
              const material = mesh.material;
              if (material instanceof MeshStandardMaterial) {
                material.opacity = 0.8;
                material.roughness = 0.5;
              } else if (material instanceof MeshBasicMaterial) {
                material.opacity = 0.8;
              }
            }
          }
        });
      }
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <primitive object={scene.clone()} scale={scale} />
    </group>
  );
}