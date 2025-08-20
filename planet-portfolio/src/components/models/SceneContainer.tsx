import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector2 } from 'three';

interface SceneContainerProps {
  children: React.ReactNode;
}

export default function SceneContainer({ children }: SceneContainerProps) {
  const sceneRef = useRef<Group>(null);
  const { gl } = useThree();
  
  const cityCenter = { x: 20, z: 0 };
  
  const [isRotating, setIsRotating] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState(new Vector2());
  const [rotationVelocity, setRotationVelocity] = useState(0);
  
  const handlePointerDown = (event: PointerEvent) => {
    if ((event.target as HTMLElement).tagName !== 'CANVAS') return;
    
    setIsRotating(true);
    setLastMousePosition(new Vector2(event.clientX, event.clientY));
    setRotationVelocity(0);
    
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isRotating || !sceneRef.current) return;
    
    const currentMouse = new Vector2(event.clientX, event.clientY);
    const deltaX = currentMouse.x - lastMousePosition.x;
    
    const rotationSpeed = 0.0003;
    sceneRef.current.rotation.y += deltaX * rotationSpeed;
    
    setRotationVelocity(deltaX * rotationSpeed * 0.02);
    
    setLastMousePosition(currentMouse);
  };

  const handlePointerUp = () => {
    setIsRotating(false);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerEnter = () => {
    if (!isRotating) {
      gl.domElement.style.cursor = 'grab';
    }
  };

  const handlePointerLeave = () => {
    setIsRotating(false);
    gl.domElement.style.cursor = 'default';
  };

  useFrame(() => {
    if (!sceneRef.current) return;
    
    if (!isRotating && Math.abs(rotationVelocity) > 0.001) {
      sceneRef.current.rotation.y += rotationVelocity;
      
      setRotationVelocity(prev => prev * 0.95);
    }
  });

  React.useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerenter', handlePointerEnter);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerenter', handlePointerEnter);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isRotating]);

  return (
    <group 
      ref={sceneRef}
      position={[cityCenter.x, 0, cityCenter.z]}
    >
      <group position={[-cityCenter.x, 0, -cityCenter.z]}>
        {children}
      </group>
    </group>
  );
}