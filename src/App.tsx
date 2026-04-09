import React, { useState } from 'react';
import './App.css';
import { useGameEngine } from './game/useGameEngine';
import { BUILDINGS } from './game/constants';
import type { BuildingType, Resources } from './game/types';

const GRID_SIZE = 50;

// Categorie per la UX della Sidebar
const BUILDING_CATEGORIES = {
  'Infrastrutture': ['house', 'well', 'road', 'wall', 'tower', 'granary'],
  'Estrazione': ['farm', 'lumber_mill', 'stone_quarry', 'iron_mine'],
  'Produzione': ['blacksmith', 'brewery', 'tailor', 'jeweler'],
  'Istituzioni': ['keep', 'barracks', 'market', 'church', 'university', 'cathedral']
};

function App() {
  const { gameState, buildBuilding, assignWorker, toggleLaw, resetGame, resolveDialogue } = useGameEngine();
  const [activeTab, setActiveTab] = useState<'map' | 'laws' | 'factions' | 'economy'>('map');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState<string>('Infrastrutture');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((e.clientY - rect.top) / GRID_SIZE);
    setMousePos({ x, y });
  };

  const canAfford = (cost: Partial<Resources>) => {
      return Object.entries(cost).every(([r, a]) => gameState.resources[r as keyof Resources] >= (a as number));
  };

  const getBuildingIcon = (type: string) => {
    switch(type) {
      case 'road': return '🛣️'; case 'wall': return '🧱'; case 'well': return '⛲'; case 'tower': return '🏰';
      default: return '';
    }
  }

  return (
    <div className="game-container">
      {/* HUD PREMIUM */}
      <div className="hud">
        <div className="hud-section primary-res">
          <div className="res-badge" title="Legno">🪵 <span>{Math.floor(gameState.resources.wood)}</span></div>
          <div className="res-badge" title="Pietra">🪨 <span>{Math.floor(gameState.resources.stone)}</span></div>
          <div className="res-badge" title="Ferro">⛓️ <span>{Math.floor(gameState.resources.iron)}</span></div>
          <div className={`res-badge ${gameState.resources.food < 50 ? 'danger' : ''}`} title="Cibo">
            🌾 <span>{Math.floor(gameState.resources.food)}</span>
          </div>
          <div className="res-badge" title="Oro">💰 <span>{Math.floor(gameState.resources.gold)}</span></div>
        </div>

        <div className="hud-section secondary-res">
          <div className="res-badge" title="Prestigio">👑 <span style={{color: 'var(--color-gold)'}}>{Math.floor(gameState.resources.prestige)}</span></div>
          <div className="res-badge" title="Pietà">🙏 <span style={{color: '#ce93d8'}}>{Math.floor(gameState.resources.piety)}</span></div>
          <div className="res-badge" title="Conoscenza">📘 <span style={{color: '#81d4fa'}}>{Math.floor(gameState.resources.knowledge)}</span></div>
        </div>

        <div className="hud-section status-res">
          <div className={`res-badge ${gameState.population.health < 50 ? 'danger' : ''}`} title="Salute">❤️ <span>{Math.floor(gameState.population.health)}%</span></div>
          <div className={`res-badge ${gameState.population.happiness < 50 ? 'danger' : ''}`} title="Felicità">😊 <span>{Math.floor(gameState.population.happiness)}%</span></div>
          <div className="res-badge" title="Popolazione">👥 <span>{gameState.population.total}</span></div>
          <div className="res-badge" title="Difesa">🛡️ <span>{Math.floor(gameState.defenseRating)}</span></div>
        </div>

        <div className="hud-section time-res">
          <div className="res-badge">📅 <span>G{gameState.time.day} M{gameState.time.month} Y{gameState.time.year}</span></div>
        </div>
      </div>

      <div className="main-layout">
        {/* NAVIGAZIONE VERTICALE */}
        <div className="game-nav-side">
          <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>🗺️ Mappa</button>
          <button className={activeTab === 'laws' ? 'active' : ''} onClick={() => setActiveTab('laws')}>📜 Editti</button>
          <button className={activeTab === 'factions' ? 'active' : ''} onClick={() => setActiveTab('factions')}>🤝 Gilde</button>
          <button className={activeTab === 'economy' ? 'active' : ''} onClick={() => setActiveTab('economy')}>⚖️ Tesoro</button>
        </div>

        <div className="content-area">
          {activeTab === 'map' && (
            <div className="map-view">
              <div className="game-map-wrapper">
                <div className="map-world" style={{ width: 2500, height: 2500 }} onMouseMove={handleMouseMove} onClick={() => selectedBuilding && buildBuilding(selectedBuilding, mousePos.x, mousePos.y)}>
                  {gameState.resourceNodes.map(n => (
                    <div key={n.id} className={`node ${n.type}`} style={{ left: n.x * GRID_SIZE, top: n.y * GRID_SIZE }}>
                      {n.type === 'forest' ? '🌲' : n.type === 'stone_deposit' ? '🪨' : n.type === 'iron_deposit' ? '⛓️' : n.type === 'mountain' ? '⛰️' : '💧'}
                    </div>
                  ))}
                  
                  {gameState.buildings.map(b => (
                    <div key={b.id} className={`building ${b.type} ${b.efficiencyBonus > 0 ? 'boosted' : ''}`} style={{ left: b.x * GRID_SIZE, top: b.y * GRID_SIZE }}>
                      {getBuildingIcon(b.type)}
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
                  
                  {selectedBuilding && (
                    <div className={`ghost ${canAfford(BUILDINGS[selectedBuilding].cost) ? 'valid' : 'invalid'}`} style={{ left: mousePos.x * GRID_SIZE, top: mousePos.y * GRID_SIZE }}>
                      {getBuildingIcon(selectedBuilding)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* SIDEBAR COSTRUZIONI MIGLIORATA */}
              <div className="map-sidebar">
                 <h2 className="sidebar-title">Architettura</h2>
                 
                 <div className="category-tabs">
                   {Object.keys(BUILDING_CATEGORIES).map(cat => (
                     <button key={cat} className={activeCategory === cat ? 'active' : ''} onClick={() => setActiveCategory(cat)}>
                       {cat}
                     </button>
                   ))}
                 </div>

                 <div className="b-list scrollable">
                   {BUILDING_CATEGORIES[activeCategory as keyof typeof BUILDING_CATEGORIES].map(bKey => {
                     const b = BUILDINGS[bKey as BuildingType];
                     if (!b) return null;
                     const affordable = canAfford(b.cost);

                     return (
                       <div key={b.type} className={`b-card ${selectedBuilding === b.type ? 'sel' : ''} ${!affordable ? 'disabled' : ''}`} onClick={() => affordable && setSelectedBuilding(b.type)}>
                         <div className="b-card-header">
                            <strong>{b.name}</strong>
                            {b.maxWorkers > 0 && <span className="b-workers">👥 {b.maxWorkers}</span>}
                         </div>
                         <p className="b-desc">{b.description}</p>
                         <div className="b-cost-row">
                           {Object.entries(b.cost).map(([r, a]) => {
                             const hasEnough = gameState.resources[r as keyof Resources] >= (a as number);
                             return <span key={r} className={`cost-item ${!hasEnough ? 'cost-missing' : ''}`}>{a} {r.substring(0,2).toUpperCase()}</span>
                           })}
                         </div>
                       </div>
                     );
                   })}
                 </div>
                 
                 <div className="sidebar-footer">
                    <button className="danger-btn" onClick={resetGame}>Resetta Regno</button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'laws' && (
            <div className="panel-view">
              <h2 className="panel-title">Editti Reali</h2>
              <p className="panel-subtitle">Promulga leggi per plasmare la società, ma attento alle reazioni delle Gilde.</p>
              <div className="laws-grid">
                {gameState.laws.map(l => (
                  <div key={l.id} className={`law-card ${l.active ? 'active' : ''}`}>
                    <div className="law-header"><h3>{l.name}</h3></div>
                    <div className="law-body">
                      <p>{l.description}</p>
                      <p className="law-cost">Costo: <strong>{l.prestigeCost} 👑</strong></p>
                    </div>
                    <button className={`action-btn ${l.active ? 'btn-active' : ''}`} onClick={() => toggleLaw(l.id)}>
                      {l.active ? 'Revoca Editto' : 'Proclama Editto'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'factions' && (
            <div className="panel-view">
              <h2 className="panel-title">Gilde e Fazioni</h2>
              <p className="panel-subtitle">Le tue decisioni politiche influenzano il favore delle potenti caste del regno.</p>
              <div className="factions-grid">
                {gameState.factions.map(f => (
                  <div key={f.type} className="faction-card">
                    <div className="faction-header"><h3>{f.name}</h3></div>
                    <div className="faction-body">
                      <div className="favor-bar-container">
                          <div className="favor-fill" style={{ width: `${(f.favor + 100) / 2}%`, backgroundColor: f.favor < -20 ? '#f44336' : f.favor > 20 ? '#4caf50' : '#ff9800' }}></div>
                      </div>
                      <p className="favor-val">Favore: <span style={{color: f.favor < 0 ? '#f44336' : '#4caf50'}}>{f.favor}</span></p>
                      <p className="faction-bonus">Bonus: <em>{f.bonus}</em></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'economy' && (
            <div className="panel-view">
              <h2 className="panel-title">Tesoro e Beni di Lusso</h2>
              <div className="econ-dashboard">
                <div className="econ-card macro">
                  <h3>Macroeconomia</h3>
                  <div className="econ-stat-row"><span>Debito Reale:</span> <span className="danger-text">{Math.floor(gameState.debt)} 💰</span></div>
                  <div className="econ-stat-row"><span>Inflazione:</span> <span className={gameState.inflation > 1.1 ? 'danger-text' : 'success-text'}>{gameState.inflation.toFixed(2)}x</span></div>
                  <div className="econ-stat-row"><span>Tassazione:</span> <span>{Math.floor(gameState.taxRate * 100)}%</span></div>
                </div>
                <div className="econ-card luxury">
                  <h3>Beni di Lusso (Consumo)</h3>
                  <p className="hint">Essenziali per la felicità di Cittadini e Nobili.</p>
                  <div className="lux-grid">
                    <div className="lux-item"><div className="lux-icon">🍺</div><div className="lux-val">{Math.floor(gameState.resources.beer)}</div><span>Birra</span></div>
                    <div className="lux-item"><div className="lux-icon">👗</div><div className="lux-val">{Math.floor(gameState.resources.clothes)}</div><span>Vestiti</span></div>
                    <div className="lux-item"><div className="lux-icon">🍷</div><div className="lux-val">{Math.floor(gameState.resources.wine)}</div><span>Vino</span></div>
                    <div className="lux-item"><div className="lux-icon">💎</div><div className="lux-val">{Math.floor(gameState.resources.jewelry)}</div><span>Gioielli</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
