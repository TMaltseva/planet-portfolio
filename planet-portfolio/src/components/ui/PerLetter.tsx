import type { CSSProperties } from 'react';

interface PerLetterProps {
  text: string;
  className?: string;
  delayOffsetSec?: number;
  staggerSec?: number;
}

export default function PerLetter({ text, className, delayOffsetSec = 0, staggerSec = 0.06 }: PerLetterProps) {
  const chars = Array.from(text);
  return (
    <div className={`appear-line${className ? ` ${className}` : ''}`}>
      {chars.map((ch, i) => {
        const style: CSSProperties & { '--d': string } = {
          '--d': `${delayOffsetSec + i * staggerSec}s`,
        };
        return (
          <span key={`${ch}-${i}`} className="appear-char highlight-outline" style={style}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        );
      })}
    </div>
  );
}


