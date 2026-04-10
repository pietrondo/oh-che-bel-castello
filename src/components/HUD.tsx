import React, { useState, useEffect } from 'react';
import { ResourceBadge } from './ResourceBadge';
import type { Resources, SeasonType } from '../game/types';
import { SEASONS } from '../game/constants';

interface HUDProps {
  resources: Resources;
  population: { total: number };
  defenseRating: number;
  year: number;
  season: SeasonType;
  day: number;
  month: number;
  piety?: number;
}

export function HUD({ resources, population, defenseRating, year, season, day, month, piety }: HUDProps) {
  const [seasonPhase, setSeasonPhase] = useState<'start' | 'mid' | 'late'>('start');
  
  useEffect(() => {
    const monthInSeason = ((month - 1) % 3) + 1;
    if (monthInSeason === 1) setSeasonPhase('start');
    else if (monthInSeason === 2) setSeasonPhase('mid');
    else setSeasonPhase('late');
  }, [month]);
  return (
    <div className="hud">
      <div className="res-group">
        <ResourceBadge icon="🪵" value={resources.wood} resourceId="wood" />
        <ResourceBadge icon="🪨" value={resources.stone} resourceId="stone" />
        <ResourceBadge icon="💰" value={resources.gold} resourceId="gold" />
      </div>
      
      <div className="res-group">
        <ResourceBadge icon="🥩" value={resources.food} resourceId="food" />
        <ResourceBadge icon="📘" value={resources.knowledge} color="#81d4fa" resourceId="knowledge" />
        <ResourceBadge icon="👑" value={resources.prestige} color="var(--color-gold)" resourceId="prestige" />
      </div>
      
      <div className="res-group">
        <ResourceBadge icon="👥" value={population.total} resourceId="population" />
        <ResourceBadge icon="🛡️" value={defenseRating} resourceId="defense" />
        {piety !== undefined && <ResourceBadge icon="🙏" value={piety} color="#c5a4e8" resourceId="piety" />}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <img src={`/assets/icons/season_${season}.png`} alt={season} style={{ width: 20, height: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7em', color: '#aaa' }}>Anno {year}</span>
            <span style={{ fontSize: '0.65em', color: seasonPhase === 'start' ? '#81c784' : seasonPhase === 'mid' ? '#ffb74d' : '#e57373' }}>
              {seasonPhase === 'start' ? 'Inizio' : seasonPhase === 'mid' ? 'Metà' : 'Fine'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
