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

const SEASON_ICONS: Record<SeasonType, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️'
};

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
        {piety !== undefined && <ResourceBadge icon="🙏" value={piety} color="#c5a4e8" />}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <span style={{ fontSize: '1.2em' }}>{SEASON_ICONS[season]}</span>
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
