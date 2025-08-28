import React, { useState, useMemo, useEffect } from 'react';
import type { TourPoint } from '../../types';
import { useJellyAssets } from '../../hooks/useJellyAssets';
import { getRandomJellyElements } from '../../utils/getRandomJellyElements';

interface ModalProps {
  showModal: boolean;
  selectedPoint: TourPoint | null;
  onClose: () => void;
}

const headerImages: Record<string, string> = {
//   about: '/src/assets/about.png',
//   skills: '/src/assets/skills.png', 
//   projects: '/src/assets/projects.png',
//   certificates: '/src/assets/study.png',
//   contact: '/src/assets/contacts.png',
};

export default function Modal({ showModal, selectedPoint, onClose }: ModalProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [jellyLoaded, setJellyLoaded] = useState<Record<string, boolean>>({});
    const [_performanceStats, _setPerformanceStats] = useState<{ avgFps: string; avgGpuLoad: string; samples: number } | null>(null);

    const jellyAssets = useJellyAssets();
    
    const stableJellyAssets = useMemo(() => jellyAssets, [jellyAssets.length]);

    const randomJellies = useMemo(() => {
      if (!selectedPoint) return [];
      return getRandomJellyElements(stableJellyAssets, 2);
    }, [selectedPoint?.id, stableJellyAssets]);

    useEffect(() => {
      if (showModal && randomJellies.length > 0) {
        randomJellies.forEach(src => {
          const img = new Image();
          img.src = src;
        });
      }
    }, [showModal, randomJellies]);

    useEffect(() => {
      if (showModal) {
        setJellyLoaded({});
      }
  }, [selectedPoint?.id]);
    if (!showModal || !selectedPoint) return null;

    const headerImageSrc = headerImages[selectedPoint.id];
  
    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };
  
    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(false);
    };

    // const estimatedGpuSavings = performanceStats ? Math.round(parseFloat(performanceStats.avgGpuLoad) * 0.3) : 0;
    // const estimatedBatterySavings = performanceStats ? 30 : 0;
  
    return (
      <div 
        className="modal-overlay"
        onClick={onClose}
        style={{
          '--color-40': `${selectedPoint.color}40`,
          '--color-20': `${selectedPoint.color}20`, 
          '--color-00': `${selectedPoint.color}00`
        } as React.CSSProperties}
      >
        <div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
              {randomJellies.map((jellySrc, index) => (
                <div
                  key={`${selectedPoint.id}-jelly-${index}`}
                  className={`modal-jelly-decoration modal-jelly-${index === 0 ? 'left' : 'right'}`}
                  style={{ opacity: jellyLoaded[jellySrc] ? 1 : 0 }}
                >
                  <img 
                    src={jellySrc} 
                    alt="decoration" 
                    className="modal-jelly-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.display = 'none';
                      }
                    }}
                    onLoad={() => {
                      setJellyLoaded(prev => ({...prev, [jellySrc]: true}));
                    }}
                  />
                </div>
              ))}

              {headerImageSrc && !imageError ? (
                <div className="modal__header-image">
                  <img 
                    src={headerImageSrc} 
                    alt={selectedPoint.title}
                    className="modal__title-image"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                      width: '280px',
                      height: 'auto',
                      maxWidth: '90%',
                      objectFit: 'contain',
                      marginBottom: '20px',
                      filter: `drop-shadow(2px 2px 8px ${selectedPoint.color}40)`,
                      display: imageLoaded ? 'block' : 'none',
                    }}
                  />
                  {!imageLoaded && !imageError && (
                    <div 
                      style={{
                        width: '280px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        color: '#666',
                      }}
                    >
                      Loading...
                    </div>
                  )}
                </div>
              ) : (
                <div className="modal__neon-title">
                  <div className="neon-line neon-once">
                    {Array.from(selectedPoint.title).map((char, index) => (
                      <span 
                        key={index} 
                        className="neon-char neon-once" 
                        style={{ 
                          '--d': `${index * 0.06}s`,
                          fontWeight: 800,
                        } as React.CSSProperties & { '--d': string }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Metrics Display */}
              {/* {performanceStats && (
                <div className="performance-metrics" style={{
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    🚀 Performance Optimization Active
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>📊 Avg FPS: <strong>{performanceStats.avgFps}</strong></div>
                    <div>⚡ GPU Load: <strong>{performanceStats.avgGpuLoad}%</strong></div>
                    <div>💾 GPU Savings: <strong>~{estimatedGpuSavings}%</strong></div>
                    <div>🔋 Battery Savings: <strong>~{estimatedBatterySavings}%</strong></div>
                  </div>
                </div>
              )} */}
              
              <div className="modal__details">
                {selectedPoint.id === 'about' && (
                  <div>
                    <p><strong>Experience:</strong> 2+ years</p>
                    <br></br>
                    <p><strong>Specialization:</strong> Frontend and creative dev</p>
                    <br></br>
                    <p>I'm interested in creative systems building/mastering a 2D/3D engine. My passion is good design and high functionality of the surrounding space.</p>
                  </div>
                )}
                {selectedPoint.id === 'skills' && (
                  <div>
                    <p><strong>Frontend:</strong> React, TypeScript, MobX, Redux, Next.js</p>
                    <p><strong>Backend:</strong> Node.js, PostgreSQL</p>
                    <p><strong>Creative dev:</strong> Three.js, Pixi.js, Phaser</p>
                  </div>
                )}
                {selectedPoint.id === 'projects' && (
                  <div className="projects-section">
                    <div className="projects-grid">
                      <a href="https://tmaltseva.github.io/progress-component/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Progress Component
                      </a>
                      <a href="https://tmaltseva.github.io/rick-and-morty-app/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Rick and Morty app
                      </a>
                      <a href="https://tmaltseva.github.io/routing-table/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Routing Table Manager
                      </a>
                      <a href="https://tmaltseva.github.io/breathing-meditation-3d/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Meditation Breathing
                      </a>
                      <a href="https://tmaltseva.github.io/todo-app/" target="_blank" rel="noopener noreferrer" className="project-link">
                      ToDo App
                      </a>
                      <a href="https://rolling-scopes-school.github.io/tmaltseva-JSFE2024Q4/news-api/" target="_blank" rel="noopener noreferrer" className="project-link">
                      News API
                      </a>
                      <a href="https://rolling-scopes-school.github.io/tmaltseva-JSFE2024Q4/decision-making-tool/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Decision Making Tool
                      </a>
                      <a href="https://rolling-scopes-school.github.io/tmaltseva-JSFE2024Q4/fun-chat/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Fun Chat
                      </a>
                      <a href="https://rolling-scopes-school.github.io/tmaltseva-JSFE2024Q4/simon-says/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Simon-says
                      </a>
                      <a href="https://rolling-scopes-school.github.io/tmaltseva-JSFE2024Q4/nonograms/" target="_blank" rel="noopener noreferrer" className="project-link">
                      Nonograms
                      </a>
                    </div>
                  </div>
                )}
                {selectedPoint.id === 'certificates' && (
                  <div className="certificates-section">
                    <div className="certificates-grid">
                      <a href="https://app.rs.school/certificate/lgyer7oe" target="_blank" rel="noopener noreferrer" className="contact-link">
                        JS/FE PRE-SCHOOL
                      </a>
                      <a href="https://app.rs.school/certificate/5e6oztda" target="_blank" rel="noopener noreferrer" className="contact-link">
                        JAVASCRIPT/FRONT-END
                      </a>
                    </div>
                  </div>
                )}
                {selectedPoint.id === 'contact' && (
                  <div>
                    <p>
                        <a 
                          href="mailto:bacardeonie@gmail.com" 
                          className="contact-link"
                        >
                            <strong>My email</strong> 
                        </a>
                    </p>
                    <br></br>
                    <p>
                        <a href="https://github.com/TMaltseva" target="_blank" rel="noopener noreferrer" className="contact-link">
                            <strong>My GitHub</strong> 
                        </a>
                    </p>
                    <br></br>
                    <p>
                        <a href="https://linkedin.com/in/tamara-maltseva-364292179" target="_blank" rel="noopener noreferrer" className="contact-link">
                        <strong>My LinkedIn</strong> 
                        </a>
                    </p>
                  </div>
                )}
              </div>
              
              <button
                className="modal__button"
                onClick={onClose}
              >
                Continue
              </button>
        </div>
      </div>
    );
}