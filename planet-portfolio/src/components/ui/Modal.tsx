import React from 'react';
import type { TourPoint } from '../../types';

interface ModalProps {
  showModal: boolean;
  selectedPoint: TourPoint | null;
  onClose: () => void;
}

export default function Modal({ showModal, selectedPoint, onClose }: ModalProps) {
  if (!showModal || !selectedPoint) return null;

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
        // style={{ border: `3px solid ${selectedPoint.color}` }}
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
          onClick={onClose}
        >
          Continue journey
        </button>
      </div>
    </div>
  );
}
