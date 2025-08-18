import { useMemo } from 'react';
import CloudInstance from "./CloudInstance";

export default function CloudsBackground() {
    const clouds = useMemo(() => {
      const result = [];
      
      for (let i = 0; i < 30; i++) {
        result.push({
            position: [
                -50 + (Math.random() - 0.5) * 1000,
                -100 + Math.random() * -50,
                -50 + (Math.random() - 0.5) * 1000
              ] as [number, number, number],
          scale: 5 + Math.random() * 10,
          rotationSpeed: (Math.random() - 0.5) * 0.005,
          floatSpeed: 0.3 + Math.random() * 0.7,
          opacity: 0.3 + Math.random() * 0.4
        });
      }
      
      return result;
    }, []);
  
    return (
      <group>
        {clouds.map((cloud, index) => (
          <CloudInstance
            key={index}
            position={cloud.position}
            scale={cloud.scale}
            rotationSpeed={cloud.rotationSpeed}
            floatSpeed={cloud.floatSpeed}
            opacity={cloud.opacity}
          />
        ))}
      </group>
    );
  }
