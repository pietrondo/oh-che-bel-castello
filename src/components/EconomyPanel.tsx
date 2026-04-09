import React from 'react';
import type { Resources, SeasonType } from '../game/types';
import { SEASONS } from '../game/constants';

interface EconomyPanelProps {
  resources: Resources;
  inflation: number;
  population: { 
    health: number; 
    happiness: number;
    peasants: number;
    citizens: number;
    nobles: number;
    total: number;
    unemployed: number;
    housed: number;
  };
  season: SeasonType;
}

export function EconomyPanel({ resources, inflation, population, season }: EconomyPanelProps) {
  const currentSeason = SEASONS.find(s => s.id === season);
  const seasonIcon: Record<string, string> = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' };
  
  return (
    <div className="panel-view">
      <h2 className="panel-title">Bilancio del Regno</h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h3 style={{ fontFamily: 'MedievalSharp', fontSize: '1.5em', margin: '0 0 10px 0' }}>
          {seasonIcon[season]} {currentSeason?.name}
        </h3>
        <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.9 }}>
          {currentSeason?.effects.grain && <span>Grano: {currentSeason.effects.grain > 1 ? '+' : ''}{((currentSeason.effects.grain - 1) * 100).toFixed(0)}% </span>}
          {currentSeason?.effects.food && <span>Cibo: {currentSeason.effects.food > 0 ? '+' : ''}{currentSeason.effects.food}/tick </span>}
          {currentSeason?.effects.happiness && <span>Felicità: {currentSeason.effects.happiness > 0 ? '+' : ''}{currentSeason.effects.happiness} </span>}
          {currentSeason?.effects.health && <span>Salute: {currentSeason.effects.health > 0 ? '+' : ''}{currentSeason.effects.health} </span>}
        </p>
      </div>
      
      <div className="econ-dashboard" style={{ marginBottom: '30px' }}>
        <div className="econ-card">
          <h3>📊 Popolazione</h3>
          <p>👨‍🌾 Contadini: {Math.floor(population.peasants)}</p>
          <p>👨‍💼 Cittadini: {Math.floor(population.citizens)}</p>
          <p>👑 Nobili: {Math.floor(population.nobles)}</p>
          <p><strong>Totale: {Math.floor(population.total)}</strong></p>
        </div>
        <div className="econ-card">
          <h3>💼 Lavoro & Abitazioni</h3>
          <p>Posti lavoro: disponibili</p>
          <p style={{ color: population.unemployed > 0 ? '#f44336' : '#4caf50' }}>
            Disoccupati: {Math.floor(population.unemployed)}
          </p>
          <p style={{ color: population.housed < population.total ? '#ff9800' : '#4caf50' }}>
            Abitati: {Math.floor(population.housed)} / {Math.floor(population.total)}
          </p>
        </div>
        <div className="econ-card">
          <h3>❤️ Benessere</h3>
          <p style={{ color: population.health >= 80 ? '#4caf50' : population.health >= 50 ? '#ff9800' : '#f44336' }}>
            Salute: {Math.floor(population.health)}%
          </p>
          <p style={{ color: population.happiness >= 80 ? '#4caf50' : population.happiness >= 50 ? '#ff9800' : '#f44336' }}>
            Felicità: {Math.floor(population.happiness)}%
          </p>
          <p>Inflazione: {inflation.toFixed(2)}x</p>
        </div>
      </div>

      <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#c9a227' }}>Giacenze Risorse</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {Object.entries(resources).map(([key, value]) => (
          <div key={key} style={{
            background: '#fff',
            border: '2px solid #263238',
            padding: '12px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{key}</span>
            <span style={{ color: '#c9a227', fontWeight: 'bold' }}>{Math.floor(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
