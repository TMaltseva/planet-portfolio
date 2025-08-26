import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial, MeshBasicMaterial } from 'three';

interface CityModelProps {
  isMobile?: boolean;
}

export default function CityModel ({ isMobile = false }: CityModelProps) {
  const { scene } = useGLTF('models/scene.gltf');
  const cityRef = useRef<Group>(null);

  const position = isMobile ? [0, -10, 0] : [20, 5, 0];
  const scale = isMobile ? 0.007 : 0.01;

  useEffect(() => {
    if (cityRef.current) {
      cityRef.current.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh;
          
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(mat => {
              const clonedMat = mat.clone();
              if (clonedMat instanceof MeshStandardMaterial) {
                clonedMat.color.multiplyScalar(1.5);
                clonedMat.color.setRGB(
                  Math.min(clonedMat.color.r * 1.1 + 0.3, 1.0),
                  Math.min(clonedMat.color.g * 0.9 + 0.2, 1.0),
                  Math.min(clonedMat.color.b * 0.8 + 0.4, 1.0)
                );
                clonedMat.roughness = 0.7;
                clonedMat.metalness = 0.1;
              } else if (clonedMat instanceof MeshBasicMaterial) {
                clonedMat.color.setRGB(
                  Math.min(clonedMat.color.r * 1.1 + 0.3, 1.0),
                  Math.min(clonedMat.color.g * 0.9 + 0.2, 1.0),
                  Math.min(clonedMat.color.b * 0.8 + 0.4, 1.0)
                );
              }
              return clonedMat;
            });
          } else {
            const clonedMaterial = mesh.material.clone();
            if (clonedMaterial instanceof MeshStandardMaterial) {
              clonedMaterial.color.multiplyScalar(1.2);
              clonedMaterial.color.setRGB(
                Math.min(clonedMaterial.color.r * 1.1 + 0.3, 1.0),
                Math.min(clonedMaterial.color.g * 0.9 + 0.2, 1.0),
                Math.min(clonedMaterial.color.b * 0.8 + 0.4, 1.0)
              );
              clonedMaterial.roughness = 0.7;
              clonedMaterial.metalness = 0.1;
            } else if (clonedMaterial instanceof MeshBasicMaterial) {
              clonedMaterial.color.setRGB(
                Math.min(clonedMaterial.color.r * 1.1 + 0.3, 1.0),
                Math.min(clonedMaterial.color.g * 0.9 + 0.2, 1.0),
                Math.min(clonedMaterial.color.b * 0.8 + 0.4, 1.0)
              );
            }
            mesh.material = clonedMaterial;
          }
        }
      });
    }
  }, [scene]);

  return (
    <group ref={cityRef}>
      <primitive 
        object={scene} 
        scale={scale}
        position={position}
      />
    </group>
  );
}
