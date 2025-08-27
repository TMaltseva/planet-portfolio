import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';
import CloudsBackground from './components/models/CloudsBackground';
import ScreenLoader from './components/ui/ScreenLoader';
import LocationFigure from './components/tour/LocationFigure';
import { useTour } from './hooks/useTour';
import { TOUR_POINTS } from './data/tourPoints';
import CameraControllerAdaptive from './components/tour/CameraControllerAdaptive';
import PlaneFlyover from './components/models/PlaneFlyover';
import Modal from './components/ui/Modal';
import JellySprites from './components/models/JellySprites';
import CityModel from './components/models/CityModel';
import SceneContainer from './components/models/SceneContainer';
import { useResponsive } from './hooks/useResponsive';
import Header from './components/Header';
import { usePreloadModels } from './hooks/usePreloadModels';
import { ModalProvider } from './contexts/ModalContext';
// import { performanceMonitor } from './utils/performanceMonitor';

import './App.css';

export default function App() {
    usePreloadModels();

    const {
      currentPointIndex,
      currentPoint,
      showModal,
      selectedPoint,
      handlePointClick,
      closeModal
    } = useTour(TOUR_POINTS);

    const [_introComplete, setIntroComplete] = useState(false);
    const [orbitControlsReady, setOrbitControlsReady] = useState(false);
    const { isMobile } = useResponsive();

    // useEffect(() => {
    //   performanceMonitor.startMonitoring();
      
    //   return () => {
    //     performanceMonitor.stopMonitoring();
    //   };
    // }, []);

    // useEffect(() => {
    //   if (showModal) {
    //     console.log('🎯 Modal opened - Animations stopped for performance optimization');
    //     console.log('💡 Expected benefits:');
    //     console.log('   • Reduced GPU load by ~30%');
    //     console.log('   • Saved battery on mobile devices');
    //     console.log('   • Improved frame rate stability');
    //   } else {
    //     console.log('🎯 Modal closed - Animations resumed');
    //   }
    // }, [showModal]);

  return (
    <div className="app-container">
      <ScreenLoader />
      <ModalProvider showModal={showModal}>
        <Canvas
          camera={{
            position: [70, 40, 50],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          className="app-canvas"
        >
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[50, 50, 25]} 
            intensity={0.7}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <pointLight position={[-20, 20, 20]} intensity={0.1} />
          
          <Environment preset="dawn" environmentIntensity={0.8}/>
          
          <Suspense fallback={null}>
            <SceneContainer isMobile={isMobile}>
              <CloudsBackground />
              <JellySprites />
              <PlaneFlyover />
              <CityModel isMobile={isMobile} />

              {TOUR_POINTS.map((point, index) => (
                <LocationFigure 
                  key={point.id} 
                  point={point} 
                  isActive={index === currentPointIndex}
                  onClick={() => handlePointClick(point)}
                />
              ))}
            </SceneContainer>
          </Suspense>

          <CameraControllerAdaptive
            currentPoint={currentPoint}
            onIntroComplete={setIntroComplete}
            onOrbitControlsReady={setOrbitControlsReady}
          />  
        </Canvas>
      </ModalProvider>
      
      {orbitControlsReady && !isMobile && (
        <div className="controls-panel">
          <div className="controls-panel__title">Controls:</div>
          <div>🖱️ Drag to rotate scene</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Click locations to learn more</div>
        </div>
      )}

      <Header />

      <Modal 
        showModal={showModal}
        selectedPoint={selectedPoint}
        onClose={closeModal}
      />

      <div className="copyright">
        © 2025 All rights reserved
      </div>
    </div>
  );
}