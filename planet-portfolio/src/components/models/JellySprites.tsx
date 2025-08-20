import { useEffect, useMemo, useRef } from 'react';
import { TextureLoader, Group, Sprite, SpriteMaterial, Vector3, MathUtils } from 'three';
import { useFrame } from '@react-three/fiber';

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

function useJellyAssets() {
  const modules = import.meta.glob('/src/assets/jelly-elements/*.png', { eager: true, import: 'default' }) as Record<string, string>;
  return Object.values(modules);
}

export default function JellySprites() {
  const groupRef = useRef<Group>(null);
  const loaderRef = useRef(new TextureLoader());

  const urls = useJellyAssets();

  const jellies: JellySpec[] = useMemo(() => {
    return urls.map((url, idx) => ({
      textureUrl: url,
      baseScale: MathUtils.lerp(3.0, 6.0, Math.random()),
      speed: 0,
      x: MathUtils.randFloat(-200, 200),
      y: MathUtils.randFloat(8, 25),
      z: MathUtils.randFloat(-150, 50),
      phase: Math.random() * Math.PI * 2,
      opacity: MathUtils.randFloat(0.9, 1),
    }));
  }, [urls]);

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

  useFrame((state, delta) => {
    sprites.forEach((sprite, idx) => {
      const spec = jellies[idx];
      const t = state.clock.elapsedTime + spec.phase;
      
      const pulse = 1 + Math.sin(t * 1.5) * 0.1;
      sprite.scale.setScalar(spec.baseScale * pulse);
      
      const sway = Math.sin(t * 0.8) * 0.5;
      const bob = Math.cos(t * 1.2) * 0.3;
      
      sprite.position.set(
        spec.x + sway,
        spec.y + bob,
        spec.z + Math.sin(t * 0.5) * 0.2
      );
      
      sprite.material.rotation = Math.sin(t * 0.3) * 0.1;
    });
  });

  return <group ref={groupRef} />;
}