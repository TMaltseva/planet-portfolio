import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export default function ScreenLoader() {
  const { active, progress } = useProgress();
  const [renderOverlay, setRenderOverlay] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress >= 100) {
      setVisible(false);
      const timeout = setTimeout(() => setRenderOverlay(false), 400);
      return () => clearTimeout(timeout);
    }
    setRenderOverlay(true);
    setVisible(true);
  }, [active, progress]);

  if (!renderOverlay) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(1200px 600px at 50% 40%, rgba(0,0,0,0.55), rgba(0,0,0,0.85))',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        zIndex: 2000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#FFD84D',
                filter: 'drop-shadow(0 0 6px rgba(255,216,77,0.85))',
                animation: 'jump 0.9s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div style={{ color: 'white', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 600, letterSpacing: '0.5px' }}>
          {Math.round(progress)}%
        </div>
      </div>

      <style>{`
        @keyframes jump {
          0% { transform: translateY(0); opacity: 0.8; }
          30% { transform: translateY(-14px); opacity: 1; }
          60% { transform: translateY(0); opacity: 0.9; }
          100% { transform: translateY(0); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}


