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
import NeonText from './components/ui/NeonText';
import PerLetter from './components/ui/PerLetter';
import SceneContainer from './components/models/SceneContainer';
import JellySprites from './components/models/JellySprites';
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
          intensity={0.5}
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
          <div className="header__greeting">
            <NeonText text={"Hello,"} sizePx={80} weight={800} letterSpacingPx={1} />
          </div>
          <div className="header__name">
            <PerLetter text={"I'm Tommy!"} />
          </div>
          <p className="header__title">
            Frontend Developer
          </p>
          <p className="header__title--no-margin">
            & 3D Enthusiast
          </p>
          <p className="header__subtitle">
            Click on the city locations to explore my portfolio
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPoint && (
        <div 
          className="modal-overlay"
          onClick={closeModal}
          style={{
            '--color-40': `${selectedPoint.color}40`,
            '--color-20': `${selectedPoint.color}20`, 
            '--color-00': `${selectedPoint.color}00`
          } as React.CSSProperties}
        >
          <div 
            className="modal-content"
            style={{ border: `3px solid ${selectedPoint.color}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              className="modal__title"
              style={{ color: selectedPoint.color }}
            >
              {selectedPoint.title}
            </h2>
            <p className="modal__description">
              {selectedPoint.description}
            </p>
            
            <div className="modal__details">
              {selectedPoint.id === 'about' && (
                <div>
                  <p><strong>Опыт:</strong> 2+ года в разработке</p>
                  <p><strong>Специализация:</strong> Frontend разработка</p>
                </div>
              )}
              {selectedPoint.id === 'skills' && (
                <div>
                  <p><strong>Frontend:</strong> React, TypeScript, Three.js</p>
                  <p><strong>Backend:</strong> Node.js, PostgreSQL</p>
                </div>
              )}
            </div>
            
            <button
              className="modal__button"
              style={{ backgroundColor: selectedPoint.color }}
              onClick={closeModal}
            >
              Continue journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}