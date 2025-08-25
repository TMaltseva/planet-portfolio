import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import styles from '../../styles/ScreenLoader.module.css';

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
  }, [active, progress]);

  useEffect(() => {
    if (active || progress < 100) {
      setRenderOverlay(true);
      setVisible(true);
    }
  }, [active, progress]);

  if (!renderOverlay) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.overlay} ${visible ? styles.visible : styles.hidden}`}
    >
      <div className={styles.container}>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.progress}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}