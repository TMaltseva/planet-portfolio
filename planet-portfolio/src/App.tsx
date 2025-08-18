import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { Environment } from '@react-three/drei';
import CityModel from './components/models/CityModel';
import { Suspense } from 'react';
import CloudsBackground from './components/models/CloudsBackground';
import LoadingFallback from './components/ui/LoadingFallback';
import LocationFigure from './components/tour/LocationFigure';
import { useTour } from './hooks/useTour';
import { TOUR_POINTS } from './data/tourPoints';
import CameraController from './components/tour/CameraController';
import PlaneFlyover from './components/models/PlaneFlyover';

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
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          position: [70, 40, 50],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.1} />
        <directionalLight 
          position={[50, 50, 25]} 
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <pointLight position={[-20, 20, 20]} intensity={0.1} />
        
        <Environment preset="dawn" environmentIntensity={0.8}/>
        
        <Suspense fallback={<LoadingFallback />}>
          <CloudsBackground />
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
        </Suspense>
        
        {/* <OrbitControls
          target={[0, 0, 0]}
          minDistance={40}
          maxDistance={50}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.3}
          minAzimuthAngle={-Math.PI * 0.25}
          maxAzimuthAngle={Math.PI * 0.85}
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          enableRotate={true}
          autoRotate={false}
          dampingFactor={0.1}
          rotateSpeed={-1}
        />  */}

        <CameraController
          currentPoint={currentPoint}
          onIntroComplete={setIntroComplete}
          onOrbitControlsReady={setOrbitControlsReady}
        />  
      </Canvas>
      
      {orbitControlsReady && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          padding: '15px',
          borderRadius: '10px',
          maxWidth: '200px',
          animation: 'slideInFromRight 0.8s ease-out',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Controls:</div>
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Click locations to learn more</div>
        </div>
      )}

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '550px',
        height: '100vh',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: 100,
        padding: '0 70px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        <div>
          <h1 style={{ fontSize: '80px', lineHeight: '1', margin: '0 0 10px 0', fontWeight: 'bold', }}>Hello, I'm Tommy!</h1>
          <p style={{ fontSize: '36px', lineHeight: '1.2', opacity: 0.9, width: '600px', }}>
            Frontend Developer & 3D Enthusiast
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.7}}>
            Click on the city locations to explore my portfolio
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPoint && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 250, 250, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in',
        }}
        onClick={closeModal}
        >
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
            border: `3px solid ${selectedPoint.color}`,
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              color: selectedPoint.color, 
              marginBottom: '20px',
              fontSize: '28px' 
            }}>
              {selectedPoint.title}
            </h2>
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.6',
              marginBottom: '30px',
              color: '#333'
            }}>
              {selectedPoint.description}
            </p>
            
            <div style={{ marginBottom: '30px' }}>
              {selectedPoint.id === 'about' && (
                <div>
                  <p><strong>Опыт:</strong> 3+ года в разработке</p>
                  <p><strong>Специализация:</strong> Full-stack разработка</p>
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
              onClick={closeModal}
              style={{
                padding: '15px 30px',
                backgroundColor: selectedPoint.color,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'transform 0.2s ease',
                animation: 'pulseScale 2s infinite',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1.05)';
                target.style.animationPlayState = 'paused';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1)';
                target.style.animationPlayState = 'running';
              }}
            >
              Continue journey
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: scale(0.9);
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
            backdrop-filter: blur(10px);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 ${selectedPoint?.color}40;
          }
          50% {
            box-shadow: 0 0 0 10px ${selectedPoint?.color}20;
          }
          100% {
            box-shadow: 0 0 0 20px ${selectedPoint?.color}00;
          }
        }

        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

         @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
