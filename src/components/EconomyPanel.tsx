import React from 'react';
import type { Resources } from '../game/types';

interface EconomyPanelProps {
  resources: Resources;
  inflation: number;
  population: { health: number; happiness: number };
}

export function EconomyPanel({ resources, inflation, population }: EconomyPanelProps) {
  return (
    <div className="panel-view">
      <h2 className="panel-title">Bilancio del Regno</h2>
      <div className="econ-dashboard">
        <div className="econ-card">
          <h3>Risorse Speciali</h3>
          <p>⚪ Farina: {Math.floor(resources.flour)}</p>
          <p>🍞 Pane: {Math.floor(resources.bread)}</p>
          <p>🍺 Birra: {Math.floor(resources.beer)}</p>
        </div>
        <div className="econ-card">
          <h3>Statistiche</h3>
          <p>Inflazione: {inflation.toFixed(2)}x</p>
          <p>Salute: {Math.floor(population.health)}%</p>
          <p>Felicità: {Math.floor(population.happiness)}%</p>
        </div>
      </div>
    </div>
  );
}
