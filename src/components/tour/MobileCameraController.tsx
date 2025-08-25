import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';
import type { TourPoint } from '../../types';

interface MobileCameraControllerProps {
  currentPoint: TourPoint;
  onIntroComplete?: (complete: boolean) => void;
  onOrbitControlsReady?: (ready: boolean) => void;
  isMobile?: boolean;
}

export default function MobileCameraController({ 
  onIntroComplete,
  onOrbitControlsReady,
  isMobile = false
}: MobileCameraControllerProps) {
  const { camera } = useThree();
  const [introComplete, setIntroComplete] = useState(false);
  const [allowOrbitControls, setAllowOrbitControls] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'intro' | 'settling' | 'controls'>('intro');
  const startTime = useRef<number | null>(null);
  const settlingStartTime = useRef<number | null>(null);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
  
  const introDuration = isMobile ? 2500 : 4000;
  const settlingDuration = isMobile ? 500 : 1000;
  
  const initialPosition = isMobile 
    ? new Vector3(40, 30, 40)
    : new Vector3(500, 200, 500);
    
  const overviewPosition = isMobile 
    ? new Vector3(25, 20, 25)
    : new Vector3(40, 25, 40);

  const cameraTarget: [number, number, number] = isMobile ? [0, 0, 0] : [0, 0, 0];

  useEffect(() => {
    camera.position.copy(initialPosition);
    camera.lookAt(...cameraTarget);
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

  useFrame((_state, delta) => {
    if (!startTime.current) return;

    const elapsed = Date.now() - startTime.current;
    
    if (transitionPhase === 'intro' && elapsed < introDuration) {
      const progress = elapsed / introDuration;
      
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentPos = initialPosition.clone().lerp(overviewPosition, easeProgress);
      camera.position.copy(currentPos);
      camera.lookAt(...cameraTarget);
      
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
        camera.position.lerp(overviewPosition, delta * 2);
        camera.lookAt(...cameraTarget);
        return;
      } else {
        setTransitionPhase('controls');
        setAllowOrbitControls(true);
        
        if (orbitControlsRef.current) {
          orbitControlsRef.current.object.position.copy(overviewPosition);
          orbitControlsRef.current.target.set(...cameraTarget);
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
          target={cameraTarget}
          minDistance={isMobile ? 15 : 50}
          maxDistance={isMobile ? 60 : 120}
          
          minPolarAngle={isMobile ? Math.PI * 0.05 : Math.PI * 0.1}
          maxPolarAngle={isMobile ? Math.PI * 0.6 : Math.PI * 0.4} 
          
          minAzimuthAngle={isMobile ? -Infinity : -Math.PI * 0.25}
          maxAzimuthAngle={isMobile ? Infinity : Math.PI * 0.25}
          
          enablePan={false}
          
          enableZoom={true}
          
          enableRotate={true}
          
          enableDamping={true}
          dampingFactor={isMobile ? 0.08 : 0.1}
          
          rotateSpeed={isMobile ? 0.8 : -0.5}
          
          zoomSpeed={isMobile ? 0.5 : 0.3}
          
          enabled={transitionPhase === 'controls'}
        />
      )}
    </>
  );
}
