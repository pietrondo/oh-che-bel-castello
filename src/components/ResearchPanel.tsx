import React from 'react';
import { TechCard } from './TechCard';
import type { Technology } from '../game/types';

interface ResearchPanelProps {
  technologies: Technology[];
  knowledge: number;
  onUnlockTech: (id: string) => void;
}

export function ResearchPanel({ technologies, knowledge, onUnlockTech }: ResearchPanelProps) {
  return (
    <div className="panel-view">
      <h2 className="panel-title">Albero delle Tecnologie</h2>
      <div className="tech-grid">
        {technologies.map(tech => (
          <TechCard
            key={tech.id}
            technology={tech}
            knowledge={knowledge}
            onUnlock={onUnlockTech}
          />
        ))}
      </div>
    </div>
  );
}
