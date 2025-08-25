import type { CSSProperties } from 'react';

interface NeonTextProps {
  text: string;
  className?: string;
  sizePx?: number;
  weight?: number | string;
  letterSpacingPx?: number;
  delayOffsetSec?: number;
}

export default function NeonText({
  text,
  className,
  weight = 800,
  letterSpacingPx = 1,
  delayOffsetSec = 0,
}: NeonTextProps) {
  const chars = Array.from(text);
  return (
    <div
      className={`neon-line neon-once${className ? ` ${className}` : ''}`}
      style={{ fontWeight: weight, letterSpacing: `${letterSpacingPx}px` }}
    >
      {chars.map((ch, i) => {
        const style: CSSProperties & { '--d': string } = {
          '--d': `${delayOffsetSec + i * 0.06}s`,
        };
        return (
          <span key={i} className="neon-char neon-once" style={style}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        );
      })}
    </div>
  );
}


