import React from 'react';
import type { Technology } from '../game/types';

interface TechCardProps {
  technology: Technology;
  knowledge: number;
  onUnlock: (id: string) => void;
}

export function TechCard({ technology, knowledge, onUnlock }: TechCardProps) {
  const canAfford = knowledge >= technology.cost;

  return (
    <div className={`tech-card ${technology.unlocked ? 'unlocked' : ''}`}>
      <div className="tech-icon">{technology.icon}</div>
      <div className="tech-info">
        <h3>{technology.name}</h3>
        <p>{technology.description}</p>
        {technology.unlocked ? (
          <span className="status-label">Sbloccata</span>
        ) : (
          <button
            disabled={!canAfford}
            onClick={() => onUnlock(technology.id)}
          >
            Ricerca ({technology.cost} 📘)
          </button>
        )}
      </div>
    </div>
  );
}
