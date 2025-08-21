import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { Environment } from '@react-three/drei';
import CityModel from './components/models/CityModel';
import { Suspense } from 'react';
import CloudsBackground from './components/models/CloudsBackground';
import ScreenLoader from './components/ui/ScreenLoader';
import LocationFigure from './components/tour/LocationFigure';
import { useTour } from './hooks/useTour';
import { TOUR_POINTS } from './data/tourPoints';
import CameraController from './components/tour/CameraController';
import PlaneFlyover from './components/models/PlaneFlyover';
import Modal from './components/ui/Modal';
import SceneContainer from './components/models/SceneContainer';
import JellySprites from './components/models/JellySprites';
import jellyHeaderImage from '../src/assets/jelly-header.png';
import NeonText from './components/ui/NeonText';
import PerLetter from './components/ui/PerLetter';

import './App.css';

export default function App() {
    const {
      currentPointIndex,
      currentPoint,
      showModal,
      selectedPoint,
      handleNextPoint,
      handlePointClick,
      closeModal
    } = useTour(TOUR_POINTS);

    const [introComplete, setIntroComplete] = useState(false);
    const [orbitControlsReady, setOrbitControlsReady] = useState(false);
    const [showHeaderText, setShowHeaderText] = useState(false);

    const handleHeaderClick = () => {
      setShowHeaderText(!showHeaderText);
    };

  return (
    <div className="app-container">
      <ScreenLoader />
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
          <SceneContainer>
            <CloudsBackground />
            <JellySprites />
            <PlaneFlyover />
            <CityModel />

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

        <CameraController
          currentPoint={currentPoint}
          onIntroComplete={setIntroComplete}
          onOrbitControlsReady={setOrbitControlsReady}
        />  
      </Canvas>
      
      {orbitControlsReady && (
        <div className="controls-panel">
          <div className="controls-panel__title">Controls:</div>
          <div>🖱️ Drag to rotate scene</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Click locations to learn more</div>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="header__panel frosted-panel">
          {showHeaderText ? (
            <div className="header__text-content" onClick={handleHeaderClick} style={{ cursor: 'pointer' }}>
              <div className="header__title">
                <NeonText text={"Frontend Dev"} sizePx={50} weight={700} letterSpacingPx={1} />
              </div>
              <div className="header__title--no-margin">
                <PerLetter text={"& 3D Enthusiast"} />
              </div>
              <p className="header__subtitle">
                Click on the city locations to explore my portfolio
              </p>
            </div>
          ) : (
            <div className="header__image">
              <img 
                src="/src/assets/jelly-header.png" 
                alt="Hello, I'm Tommy!" 
                className="header__jelly-image"
                onClick={handleHeaderClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal 
        showModal={showModal}
        selectedPoint={selectedPoint}
        onClose={closeModal}
      />
    </div>
  );
}