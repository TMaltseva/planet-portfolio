import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import type { TourPoint } from '../../types';

interface CameraControllerProps {
  currentPoint: TourPoint;
  onIntroComplete?: (complete: boolean) => void;
  onOrbitControlsReady?: (ready: boolean) => void;
}

export default function CameraController({ 
  onIntroComplete,
  onOrbitControlsReady
}: CameraControllerProps) {
  const { camera } = useThree();
  const [introComplete, setIntroComplete] = useState(false);
  const [allowOrbitControls, setAllowOrbitControls] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'intro' | 'settling' | 'controls'>('intro');
  const startTime = useRef<number | null>(null);
  const settlingStartTime = useRef<number | null>(null);
  const orbitControlsRef = useRef<any>(null);
  
  const introDuration = 4000;
  const settlingDuration = 1000;
  
  const initialPosition = new Vector3(500, 200, 500);
  const overviewPosition = new Vector3(40, 25, 40);

  useEffect(() => {
    camera.position.copy(initialPosition);
    camera.lookAt(0, 0, 0);
    startTime.current = Date.now();
  }, []);

  useEffect(() => {
    if (onIntroComplete) {
      onIntroComplete(introComplete);
    }
  }, [introComplete, onIntroComplete]);

  useEffect(() => {
    if (onOrbitControlsReady) {
      onOrbitControlsReady(allowOrbitControls);
    }
  }, [allowOrbitControls, onOrbitControlsReady]);

  useFrame((state, delta) => {
    if (!startTime.current) return;

    const elapsed = Date.now() - startTime.current;
    
    if (transitionPhase === 'intro' && elapsed < introDuration) {
      const progress = elapsed / introDuration;
      
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentPos = initialPosition.clone().lerp(overviewPosition, easeProgress);
      camera.position.copy(currentPos);
      camera.lookAt(0, 0, 0);
      
      return;
    }
    
    if (transitionPhase === 'intro' && elapsed >= introDuration) {
      setTransitionPhase('settling');
      settlingStartTime.current = Date.now();
      setIntroComplete(true);
      return;
    }

    if (transitionPhase === 'settling' && settlingStartTime.current) {
      const settlingElapsed = Date.now() - settlingStartTime.current;
      
      if (settlingElapsed < settlingDuration) {
        const targetPos = new Vector3(40, 25, 40);
        camera.position.lerp(targetPos, delta * 2);
        camera.lookAt(0, 0, 0);
        return;
      } else {
        setTransitionPhase('controls');
        setAllowOrbitControls(true);
        
        if (orbitControlsRef.current) {
          orbitControlsRef.current.object.position.set(40, 25, 40);
          orbitControlsRef.current.target.set(0, 0, 0);
          orbitControlsRef.current.update();
        }
        return;
      }
    }
  });

  return (
    <>
      {allowOrbitControls && (
        <OrbitControls
          ref={orbitControlsRef}
          target={[0, 0, 0]}
          minDistance={30}
          maxDistance={80}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.4}
          minAzimuthAngle={-Math.PI * 0.25}
          maxAzimuthAngle={Math.PI * 0.25}
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          enableRotate={true}
          dampingFactor={0.1}
          rotateSpeed={-0.5}
          enabled={transitionPhase === 'controls'}
        />
      )}
    </>
  );
}