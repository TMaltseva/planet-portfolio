import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector2 } from 'three';
import { useModalContext } from '../../contexts/ModalContext';

interface SceneContainerProps {
  children: React.ReactNode;
  isMobile?: boolean;
}

export default function SceneContainer({ children, isMobile = false }: SceneContainerProps) {
  const sceneRef = useRef<Group>(null);
  const { gl } = useThree();
  const { showModal } = useModalContext();
  
  const cityCenter = isMobile ? { x: 0, z: 0 } : { x: 20, z: 0 };
  
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
    
    const rotationSpeed = isMobile ? 0.0005 : 0.0003;
    sceneRef.current.rotation.y += deltaX * rotationSpeed;
    
    setRotationVelocity(deltaX * rotationSpeed * 0.02);
    
    setLastMousePosition(currentMouse);
  };

  const handlePointerUp = () => {
    setIsRotating(false);
    gl.domElement.style.cursor = isMobile ? 'default' : 'grab';
  };

  const handlePointerEnter = () => {
    if (!isRotating && !isMobile) {
      gl.domElement.style.cursor = 'grab';
    }
  };

  const handlePointerLeave = () => {
    setIsRotating(false);
    gl.domElement.style.cursor = 'default';
  };

  useFrame(() => {
    if (showModal) return;
    
    if (!sceneRef.current) return;
    
    if (!isRotating) {
      if (!isMobile && Math.abs(rotationVelocity) < 0.001) {
        sceneRef.current.rotation.y += 0.0008;
      } else {
        sceneRef.current.rotation.y += rotationVelocity;
        setRotationVelocity(prev => prev * 0.95);
      }
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    
    if (!isMobile) {
      canvas.addEventListener('pointerenter', handlePointerEnter);
      canvas.addEventListener('pointerleave', handlePointerLeave);
    }
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      
      if (!isMobile) {
        canvas.removeEventListener('pointerenter', handlePointerEnter);
        canvas.removeEventListener('pointerleave', handlePointerLeave);
      }
    };
  }, [isRotating, isMobile]);

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
