import React, { useState } from 'react';
import './App.css';
import { useGameEngine } from './game/useGameEngine';
import { BUILDINGS } from './game/constants';
import type { BuildingType, Resources } from './game/types';

const GRID_SIZE = 50;

const BUILDING_CATEGORIES = {
  'Base': ['house', 'farm', 'lumber_mill', 'stone_quarry', 'well', 'road'],
  'Industria': ['windmill', 'bakery', 'sheep_farm', 'weaving_mill', 'blacksmith', 'iron_mine'],
  'Corte & Fede': ['keep', 'barracks', 'church', 'university', 'cathedral', 'manor']
};

function App() {
  const { gameState, buildBuilding, assignWorker, toggleLaw, resetGame } = useGameEngine();
  const [activeTab, setActiveTab] = useState<'map' | 'court' | 'laws'>('map');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState<string>('Base');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE);
    setMousePos({ x, y });
  };

  const canAfford = (cost: Partial<Resources>) => {
      return Object.entries(cost).every(([r, a]) => gameState.resources[r as keyof Resources] >= (a as number));
  };

  return (
    <div className="game-container">
      {/* HUD AGGIORNATO CON FILIERA CIBO */}
      <div className="hud">
        <div className="hud-section">
          <div className="res-badge">🪵 {Math.floor(gameState.resources.wood)}</div>
          <div className="res-badge">🪨 {Math.floor(gameState.resources.stone)}</div>
          <div className="res-badge">💰 {Math.floor(gameState.resources.gold)}</div>
        </div>
        <div className="hud-section">
          <div className="res-badge">🌾 {Math.floor(gameState.resources.grain)}</div>
          <div className="res-badge">⚪ {Math.floor(gameState.resources.flour)}</div>
          <div className="res-badge">🍞 {Math.floor(gameState.resources.bread)}</div>
          <div className="res-badge">🥩 {Math.floor(gameState.resources.food)}</div>
        </div>
        <div className="hud-section">
          <div className="res-badge">👑 {Math.floor(gameState.resources.prestige)}</div>
          <div className="res-badge">🛡️ {Math.floor(gameState.defenseRating)}</div>
          <div className="res-badge">📅 Anno {gameState.time.year}</div>
        </div>
      </div>

      <div className="main-layout">
        <div className="game-nav-side">
          <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>🗺️ Regno</button>
          <button className={activeTab === 'court' ? 'active' : ''} onClick={() => setActiveTab('court')}>🏛️ Corte</button>
          <button className={activeTab === 'laws' ? 'active' : ''} onClick={() => setActiveTab('laws')}>📜 Leggi</button>
        </div>

        <div className="content-area">
          {activeTab === 'map' && (
            <div className="map-view">
              <div className="game-map-wrapper">
                <div className="map-world" style={{ width: 2500, height: 2500 }} onMouseMove={handleMouseMove} onClick={() => selectedBuilding && buildBuilding(selectedBuilding, mousePos.x, mousePos.y)}>
                  {gameState.resourceNodes.map(n => <div key={n.id} className={`node ${n.type}`} style={{ left: n.x * GRID_SIZE, top: n.y * GRID_SIZE }} />)}
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
                  {selectedBuilding && <div className={`ghost ${canAfford(BUILDINGS[selectedBuilding].cost) ? 'valid' : 'invalid'}`} style={{ left: mousePos.x * GRID_SIZE, top: mousePos.y * GRID_SIZE }} />}
                </div>
              </div>
              
              <div className="map-sidebar">
                 <h2 className="sidebar-title">Costruzioni</h2>
                 <div className="category-tabs">
                   {Object.keys(BUILDING_CATEGORIES).map(cat => (
                     <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>{cat}</button>
                   ))}
                 </div>
                 <div className="b-list scrollable">
                   {BUILDING_CATEGORIES[activeCategory as keyof typeof BUILDING_CATEGORIES].map(bKey => {
                     const b = BUILDINGS[bKey as BuildingType];
                     const affordable = canAfford(b.cost);
                     return (
                       <div key={b.type} className={`b-card ${selectedBuilding === b.type ? 'sel' : ''} ${!affordable ? 'disabled' : ''}`} onClick={() => affordable && setSelectedBuilding(b.type)}>
                         <strong>{b.name}</strong>
                         <p className="b-desc">{b.description}</p>
                         <div className="b-cost-row">
                           {Object.entries(b.cost).map(([r, a]) => <span key={r} className="cost-item">{a} {r[0].toUpperCase()}</span>)}
                         </div>
                       </div>
                     );
                   })}
                 </div>
                 <button className="reset-btn" onClick={resetGame}>Nuova Partita</button>
              </div>
            </div>
          )}

          {activeTab === 'court' && (
            <div className="panel-view">
              <h2 className="panel-title">Corte di {gameState.sovereign.name}</h2>
              <div className="sovereign-card">
                <div className="portrait-large">{gameState.sovereign.portrait}</div>
                <div className="sovereign-details">
                  <h3>{gameState.sovereign.name}</h3>
                  <p>Età: {gameState.sovereign.age} anni</p>
                  <p>Tratti: {gameState.sovereign.traits.join(', ')}</p>
                </div>
              </div>
              {gameState.heir && (
                <div className="heir-card">
                  <h4>Erede al Trono: {gameState.heir.name}</h4>
                  <p>Età: {gameState.heir.age} anni | Tratti: {gameState.heir.traits.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'laws' && (
            <div className="panel-view">
              <h2 className="panel-title">Editti Regi</h2>
              <div className="laws-grid">
                {gameState.laws.map(l => (
                  <div key={l.id} className={`law-card ${l.active ? 'active' : ''}`}>
                    <h3>{l.name}</h3>
                    <p>{l.description}</p>
                    <p>Costo: {l.cost} 👑</p>
                    <button className="action-btn" onClick={() => toggleLaw(l.id)}>{l.active ? 'Abroga' : 'Proclama'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
