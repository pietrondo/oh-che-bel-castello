import React from 'react';
import { ResourceBadge } from './ResourceBadge';
import type { Resources } from '../game/types';

interface HUDProps {
  resources: Resources;
  population: { total: number };
  defenseRating: number;
  year: number;
}

export function HUD({ resources, population, defenseRating, year }: HUDProps) {
  return (
    <div className="hud">
      <div className="res-group">
        <ResourceBadge icon="🪵" value={resources.wood} />
        <ResourceBadge icon="🪨" value={resources.stone} />
        <ResourceBadge icon="💰" value={resources.gold} />
      </div>
      
      <div className="res-group">
        <ResourceBadge icon="🥩" value={resources.food} />
        <ResourceBadge icon="📘" value={resources.knowledge} color="#81d4fa" />
        <ResourceBadge icon="👑" value={resources.prestige} color="var(--color-gold)" />
      </div>
      
      <div className="res-group">
        <ResourceBadge icon="👥" value={population.total} />
        <ResourceBadge icon="🛡️" value={defenseRating} />
        <ResourceBadge icon="📅" value={year} />
      </div>
    </div>
  );
}
