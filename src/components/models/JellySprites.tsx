import { useEffect, useMemo, useRef } from 'react';
import { TextureLoader, Group, Sprite, SpriteMaterial, MathUtils } from 'three';
import { useFrame } from '@react-three/fiber';
import { useJellyAssets } from '../../hooks/useJellyAssets';
import { useModalContext } from '../../contexts/ModalContext';

interface JellySpec {
  textureUrl: string;
  baseScale: number;
  speed: number;
  x: number;
  y: number;
  z: number;
  phase: number;
  opacity: number;
}

export default function JellySprites() {
  const groupRef = useRef<Group>(null);
  const loaderRef = useRef(new TextureLoader());
  const { showModal } = useModalContext();
  
  const urls = useJellyAssets();

  const jellies: JellySpec[] = useMemo(() => {
    return urls.map((url, index) => {
      const seed = index * 12345;
      
      return {
        textureUrl: url,
        baseScale: MathUtils.lerp(6.0, 12.0, (Math.sin(seed) + 1) / 2),
        speed: 0,
        x: MathUtils.lerp(-400, 350, (Math.sin(seed * 1.1) + 1) / 2),
        y: MathUtils.lerp(-10, 35, (Math.sin(seed * 1.3) + 1) / 2),
        z: MathUtils.lerp(-200, -80, (Math.sin(seed * 1.7) + 1) / 2),
        phase: ((Math.sin(seed * 2.1) + 1) / 2) * Math.PI * 2,
        opacity: MathUtils.lerp(0.9, 1, (Math.sin(seed * 3.3) + 1) / 2),
      };
    });
  }, [urls.length]);

  const sprites = useMemo(() => {
    return jellies.map((jelly) => {
      const texture = loaderRef.current.load(jelly.textureUrl);
      texture.premultiplyAlpha = true;
      
      const material = new SpriteMaterial({ 
        map: texture, 
        depthWrite: false, 
        transparent: true, 
        opacity: jelly.opacity
      });
      
      const sprite = new Sprite(material);
      sprite.scale.setScalar(jelly.baseScale);
      sprite.position.set(jelly.x, jelly.y, jelly.z);
      
      sprite.userData = {
        baseX: jelly.x,
        baseY: jelly.y,
        baseZ: jelly.z,
        baseScale: jelly.baseScale,
        phase: jelly.phase
      };
      
      return sprite;
    });
  }, [jellies]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    sprites.forEach((s) => group.add(s));
    return () => {
      sprites.forEach((s) => group.remove(s));
    };
  }, [sprites]);

  useFrame((state) => {
    if (showModal) return;
    
    sprites.forEach((sprite) => {
      const userData = sprite.userData;
      const t = state.clock.elapsedTime + userData.phase;
      
      const pulse = 1 + Math.sin(t * 1.5) * 0.1;
      sprite.scale.setScalar(userData.baseScale * pulse);
      
      const sway = Math.sin(t * 0.8) * 0.5;
      const bob = Math.cos(t * 1.2) * 0.3;
      const drift = Math.sin(t * 0.5) * 0.2;
      
      sprite.position.set(
        userData.baseX + sway,
        userData.baseY + bob,
        userData.baseZ + drift
      );
      
      sprite.material.rotation = Math.sin(t * 0.3) * 0.1;
    });
  });

  return <group ref={groupRef} />;
}
