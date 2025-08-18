import { useGLTF } from '@react-three/drei';

export default function CityModel() {
  const { scene } = useGLTF('/models/scene.gltf');

  return (
    <primitive 
      object={scene} 
      scale={0.01}
      position={[20, 5, 0]}
    />
  );
}

useGLTF.preload('/models/scene.gltf');
