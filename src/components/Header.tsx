import { useState } from 'react';
import jellyHeaderImage from '../assets/jelly-header.png';
import NeonText from './ui/NeonText';
import PerLetter from './ui/PerLetter';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [showHeaderText, setShowHeaderText] = useState(false);

  const handleHeaderClick = () => {
    setShowHeaderText(!showHeaderText);
  };

  return (
    <div className={styles.header}>
      <div className={`${styles.header__panel} ${styles['frosted-panel']}`}>
        {showHeaderText ? (
          <div className={styles['header__text-content']} onClick={handleHeaderClick} style={{ cursor: 'pointer' }}>
            <div className={styles.header__title}>
              <NeonText text={"Frontend Dev"} weight={700} letterSpacingPx={1} />
            </div>
            <div className={styles['header__title--no-margin']}>
              <PerLetter text={"& 3D Enthusiast"} />
            </div>
            <p className={styles.header__subtitle}>
              Click on the city locations to explore my portfolio
            </p>
          </div>
        ) : (
          <div className={styles.header__image}>
            <img 
              src={jellyHeaderImage}
              alt="Hello, I'm Tommy!" 
              className={styles['header__jelly-image']}
              onClick={handleHeaderClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
