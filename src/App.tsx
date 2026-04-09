import React, { useState } from 'react';
import './App.css';
import { useGameEngine } from './game/useGameEngine';
import { BUILDINGS } from './game/constants';
import type { BuildingType } from './game/types';

const GRID_SIZE = 50;

function App() {
  const { gameState, buildBuilding, assignWorker, resolveDialogue, resetGame } = useGameEngine();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE);
    setMousePos({ x, y });
  };

  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'forest': return '🌲';
      case 'stone_deposit': return '🪨';
      case 'iron_deposit': return '⛓️';
      case 'mountain': return '⛰️';
      case 'river': return '💧';
      default: return '';
    }
  };

  return (
    <div className="game-container">
      <div className="hud">
        <div className="res-group">
          <span>🪵 {Math.floor(gameState.resources.wood)}</span>
          <span>🪨 {Math.floor(gameState.resources.stone)}</span>
          <span>⛓️ {Math.floor(gameState.resources.iron)}</span>
          <span>🌾 {Math.floor(gameState.resources.food)}</span>
          <span>💰 {Math.floor(gameState.resources.gold)}</span>
        </div>
        <div className="res-group">
          <span>👥 {gameState.population.total}</span>
          <span>📅 G{gameState.time.day} M{gameState.time.month} Y{gameState.time.year}</span>
        </div>
      </div>

      <div className="main-layout">
        <div className="game-map">
          <div className="map-world" style={{ width: 2500, height: 2500 }} onMouseMove={handleMouseMove} onClick={() => selectedBuilding && buildBuilding(selectedBuilding, mousePos.x, mousePos.y)}>
            {/* Render Mappa */}
            {gameState.resourceNodes.map(n => (
              <div key={n.id} className={`node ${n.type}`} style={{ left: n.x * GRID_SIZE, top: n.y * GRID_SIZE }}>
                {getNodeIcon(n.type)}
              </div>
            ))}
            
            {/* Render Edifici */}
            {gameState.buildings.map(b => (
              <div key={b.id} className={`building ${b.type}`} style={{ left: b.x * GRID_SIZE, top: b.y * GRID_SIZE }}>
                <div className="b-label">{BUILDINGS[b.type].name}</div>
                {BUILDINGS[b.type].maxWorkers > 0 && (
                  <div className="w-ctrl">
                    <button onClick={(e) => { e.stopPropagation(); assignWorker(b.id, -1); }}>-</button>
                    <span>{b.assignedWorkers}</span>
                    <button onClick={(e) => { e.stopPropagation(); assignWorker(b.id, 1); }}>+</button>
                  </div>
                )}
              </div>
            ))}
            
            {selectedBuilding && <div className="ghost" style={{ left: mousePos.x * GRID_SIZE, top: mousePos.y * GRID_SIZE }} />}
          </div>
        </div>

        <div className="map-sidebar">
          <h2 style={{ fontFamily: 'MedievalSharp', textAlign: 'center' }}>Costruzioni</h2>
          <div className="b-list">
            {Object.values(BUILDINGS).map(b => (
              <div key={b.type} className={`b-card ${selectedBuilding === b.type ? 'sel' : ''}`} onClick={() => setSelectedBuilding(b.type)}>
                <strong>{b.name}</strong>
                <p style={{ fontSize: '0.7em', margin: '2px 0' }}>{b.description}</p>
                <div className="b-cost">{Object.entries(b.cost).map(([r, a]) => `${a}${r[0].toUpperCase()}`).join(' ')}</div>
              </div>
            ))}
          </div>
          <button className="reset-btn" onClick={resetGame}>Resetta Regno</button>
        </div>
      </div>

      {/* DIALOGHI */}
      {gameState.activeDialogue && (
        <div className="dialogue-overlay">
          <div className="dialogue-box">
            <div className="dialogue-header">
              <div className="portrait">{gameState.activeDialogue.portrait}</div>
              <div className="speaker-name">{gameState.activeDialogue.speaker}</div>
            </div>
            <p className="dialogue-text">{gameState.activeDialogue.text}</p>
            <div className="dialogue-options">
              {gameState.activeDialogue.options.map((opt, idx) => (
                <button key={idx} className="dialogue-opt-btn" onClick={() => resolveDialogue(idx)}>{opt.text}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState.lastDialogueResult && <div className="dialogue-result-toast">{gameState.lastDialogueResult}</div>}
    </div>
  );
}

export default App;
