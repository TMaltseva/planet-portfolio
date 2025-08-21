import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Group, TextureLoader, Sprite, SpriteMaterial, Vector3 } from 'three';
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
  const { camera } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const sprite = useMemo(() => {
    const loader = new TextureLoader();
    const texture = loader.load('/src/assets/point.png');
    texture.premultiplyAlpha = true;
    
    const material = new SpriteMaterial({ 
      map: texture, 
      transparent: true,
      alphaTest: 0.1,
      color: 0xffc0cb,
      depthTest: true,
      depthWrite: false
    });
    
    const spriteObject = new Sprite(material);
    spriteObject.scale.setScalar(2.0);
    spriteObject.position.set(0, 0.8, 0);
    
    return spriteObject;
  }, []);

  useFrame((state) => {
    if (figureRef.current && sprite) {
      const baseY = point.position[1];
      const amplitude = 0.3;
      const speed = isActive ? 2 : 1.5;
      
      figureRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed) * amplitude;
      
      figureRef.current.rotation.y += 0.005;
      
      const baseScale = isActive ? 1.3 : 1.0;
      const targetScale = isHovered ? baseScale * 1.4 : baseScale;
      const currentScale = figureRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      figureRef.current.scale.setScalar(newScale);

      sprite.scale.set(3.0 * newScale, 2.0 * newScale, 1.0);

      const worldPosition = new Vector3();
      figureRef.current.getWorldPosition(worldPosition);
      const distanceToCamera = camera.position.distanceTo(worldPosition);
      
      const focusDistance = 60;
      const maxBlurDistance = 120;
      
      let opacity = 1.0;
      if (distanceToCamera > focusDistance) {
        const blurFactor = Math.min((distanceToCamera - focusDistance) / (maxBlurDistance - focusDistance), 1.0);
        opacity = Math.max(1.0 - blurFactor * 0.7, 0.3);
      }
      
      sprite.material.opacity = opacity;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick();
  };

  const handlePointerOver = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(false);
      document.body.style.cursor = 'default';
      hoverTimeoutRef.current = null;
    }, 80);
  };

  return (
    <group 
      ref={figureRef} 
      position={point.position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <sphereGeometry args={[1.25, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <primitive object={sprite} />
      
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.8, 16]} />
        <meshBasicMaterial 
          color={point.color} 
          transparent 
          opacity={(isActive || isHovered) ? 0.6 : 0.3}
          depthWrite={false}
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