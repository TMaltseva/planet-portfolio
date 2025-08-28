import { useEffect, useMemo, useRef, useState } from 'react';
import { TextureLoader, Group, Sprite, SpriteMaterial, MathUtils, Texture } from 'three';
import { useFrame } from '@react-three/fiber';
import { useJellyAssets } from '../../hooks/useJellyAssets';
import { useModalContext } from '../../contexts/ModalContext';

interface JellySpec {
  textureUrl: string;
  baseScale: number;
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
  const [sprites, setSprites] = useState<Sprite[]>([]);
  
  const urls = useJellyAssets();

  const jellies: JellySpec[] = useMemo(() => {
    if (urls.length === 0) return [];
    
    const targetCount = 15;
    const jelliesArray = [];
    
    for (let i = 0; i < targetCount; i++) {
      const urlIndex = i % urls.length;
      const url = urls[urlIndex];
      const seed = i * 12345;
      
      jelliesArray.push({
        textureUrl: url,
        baseScale: MathUtils.lerp(6.0, 12.0, (Math.sin(seed) + 1) / 2),
        x: MathUtils.lerp(-400, 350, (Math.sin(seed * 1.1) + 1) / 2),
        y: MathUtils.lerp(-10, 35, (Math.sin(seed * 1.3) + 1) / 2),
        z: MathUtils.lerp(-200, -80, (Math.sin(seed * 1.7) + 1) / 2),
        phase: ((Math.sin(seed * 2.1) + 1) / 2) * Math.PI * 2,
        opacity: MathUtils.lerp(0.9, 1, (Math.sin(seed * 3.3) + 1) / 2),
      });
    }
    
    return jelliesArray;
  }, [urls.length]);

  useEffect(() => {
    if (jellies.length === 0) return;
    
    const textureCache = new Map<string, Texture>();
    const newSprites: Sprite[] = [];
    let loadedCount = 0;
    
    jellies.forEach((jelly, index) => {
      let texture = textureCache.get(jelly.textureUrl);
      if (!texture) {
        texture = loaderRef.current.load(
          jelly.textureUrl,
          () => {
            loadedCount++;
            if (loadedCount === jellies.length) {
              setSprites([...newSprites]);
            }
          },
          undefined,
          (error) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to load texture:', jelly.textureUrl, error);
            }            loadedCount++;
            if (loadedCount === jellies.length) {
              setSprites([...newSprites]);
            }
          }
        );
        texture.premultiplyAlpha = true;
        textureCache.set(jelly.textureUrl, texture);
      } else {
        loadedCount++;
      }
      
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
      
      newSprites[index] = sprite;
    });
    
    if (loadedCount === jellies.length) {
      setSprites(newSprites);
    }
    
    return () => {
      newSprites.forEach(sprite => {
        if (sprite && sprite.material) {
          if (sprite.material.map) {
            sprite.material.map.dispose();
          }
          sprite.material.dispose();
        }
      });
    };
  }, [jellies]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || sprites.length === 0) return;
    
    sprites.forEach((sprite) => {
      if (sprite) group.add(sprite);
    });
    
    return () => {
      sprites.forEach((sprite) => {
        if (sprite && group) group.remove(sprite);
      });
    };
  }, [sprites]);

  useFrame((state) => {
    if (showModal || sprites.length === 0) return;
    
    sprites.forEach((sprite) => {
      if (!sprite || !sprite.userData) return;
      
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