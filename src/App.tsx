import { useState, useEffect } from 'react';
import './App.css';
import { useGameEngine } from './game/useGameEngine';
import { BUILDINGS } from './game/constants';
import { HUD, SidebarNav, BuildingSidebar, ResearchPanel, EconomyPanel, CourtPanel, MapWithEffects, NotificationSystem, useGameNotifications, SaveManager, GameSetup, AdvancedEconomyPanel } from './components';
import { EventModal } from './components/EventModal';
import type { BuildingType, Resources } from './game/types';
import type { GameSetupData } from './components/GameSetup';

const GRID_SIZE = 50;

function App() {
  const { gameState, buildBuilding, assignWorker, unlockTech, enactLaw, updateDiplomacy, dismissEvent, resetGame, saveGame, loadGame, deleteSave, getSaveSlots, startNewGame, upgradeBuilding, startDiplomaticMission, chooseEventOption, setTaxRate, takeLoan, repayDebt } = useGameEngine();
  const { notifications, dismissNotification } = useGameNotifications();
  const [showSetup, setShowSetup] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'research' | 'economy' | 'court'>('map');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSaveManager, setShowSaveManager] = useState(false);
  const [activeEvent, setActiveEvent] = useState<{ event: any; index: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('feudal_lord_research_v1');
    const setup = localStorage.getItem('feudal_lord_setup_v1');
    if (saved && setup) {
      setShowSetup(false);
    }
  }, []);

  const canAfford = (cost: Partial<Resources>) => {
      return Object.entries(cost).every(([r, a]) => gameState.resources[r as keyof Resources] >= (a as number));
  };

  if (showSetup) {
    const saveSlots = getSaveSlots();
    return (
      <GameSetup 
        onStartGame={(setup: GameSetupData) => {
          startNewGame(setup);
          setShowSetup(false);
        }}
        onLoadGame={() => {
          setShowSetup(false);
        }}
        hasSavedGames={saveSlots.length > 0}
      />
    );
  }

  if (gameState.status === 'won' || gameState.status === 'lost') {
    return (
      <div className="game-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: gameState.status === 'won' ? 'linear-gradient(135deg, #1b5e20, #4caf50)' : 'linear-gradient(135deg, #3e2723, #1a1a1a)' }}>
        <div style={{ 
          background: '#fff', 
          padding: '40px', 
          borderRadius: '15px', 
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          <h1 style={{ 
            fontFamily: 'Eagle Lake', 
            fontSize: '2.5em', 
            color: gameState.status === 'won' ? '#2e7d32' : '#c62828',
            marginBottom: '20px'
          }}>
            {gameState.status === 'won' ? '🏆 VITTORIA!' : '💀 SCONFITTA'}
          </h1>
          <p style={{ fontSize: '1.2em', color: '#333', marginBottom: '30px' }}>{gameState.endReason}</p>
          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '30px' }}>
            Anno di gioco: {gameState.time.year} | Popolazione: {gameState.population.total} | Oro: {Math.floor(gameState.resources.gold)}
          </p>
          <button
            onClick={() => {
              resetGame();
              setShowSetup(true);
            }}
            style={{
              padding: '15px 40px',
              fontSize: '1.1em',
              background: gameState.status === 'won' ? '#2e7d32' : '#c62828',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'MedievalSharp',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Nuova Partita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <HUD 
        resources={gameState.resources}
        population={gameState.population}
        defenseRating={gameState.defenseRating}
        year={gameState.time.year}
        season={gameState.time.season}
        day={gameState.time.day}
        month={gameState.time.month}
        piety={gameState.resources.piety}
      />

      <NotificationSystem 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />

      {gameState.events.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '90px',
          left: '20px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '300px'
        }}>
          {gameState.events.slice(0, 3).map((event, idx) => (
            <div
              key={`${event.id}-${idx}`}
              onClick={() => {
                if (event.choices && event.choices.length > 0) {
                  setActiveEvent({ event, index: idx });
                } else {
                  dismissEvent(idx);
                }
              }}
              style={{
                background: event.type === 'positive' ? 'rgba(76,175,80,0.95)' : event.type === 'negative' ? 'rgba(244,67,54,0.95)' : event.type === 'crisis' ? 'rgba(255,87,34,0.95)' : event.type === 'opportunity' ? 'rgba(255,152,0,0.95)' : 'rgba(33,150,243,0.95)',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                animation: 'slideInRight 0.3s ease-out',
                backdropFilter: 'blur(5px)',
                border: event.choices ? '2px solid #ffeb3b' : 'none'
              }}
            >
              <strong style={{ display: 'block', marginBottom: '4px', fontFamily: 'MedievalSharp' }}>{event.title}</strong>
              <span style={{ fontSize: '0.9em' }}>{event.description}</span>
              {event.choices && <div style={{ fontSize: '0.75em', marginTop: '5px', fontWeight: 'bold' }}>📜 Clicca per scegliere</div>}
            </div>
          ))}
        </div>
      )}

      {activeEvent && (
        <EventModal
          event={activeEvent.event}
          onChoose={(choiceId) => {
            chooseEventOption(activeEvent.index, choiceId);
            setActiveEvent(null);
          }}
          onClose={() => setActiveEvent(null)}
          resources={gameState.resources}
          defenseRating={gameState.defenseRating}
        />
      )}

      <div className="main-layout">
        <SidebarNav 
          activeTab={activeTab}
          onTabChange={(tab: string) => setActiveTab(tab as 'map' | 'research' | 'economy' | 'court')}
          onReset={resetGame}
          onSave={() => setShowSaveManager(true)}
        />

        <div className="content-area">
           {activeTab === 'map' && (
            <div className="map-view">
              <MapWithEffects
                buildings={gameState.buildings}
                resourceNodes={gameState.resourceNodes}
                selectedBuilding={selectedBuilding}
                mousePos={mousePos}
                canAfford={selectedBuilding ? canAfford(BUILDINGS[selectedBuilding].cost) : false}
                resources={gameState.resources}
                onBuild={buildBuilding}
                onAssignWorker={assignWorker}
                onUpgradeBuilding={upgradeBuilding}
                onMouseMove={setMousePos}
              />
              <BuildingSidebar
                selectedBuilding={selectedBuilding}
                resources={gameState.resources}
                onSelectBuilding={setSelectedBuilding}
              />
            </div>
          )}

          {activeTab === 'research' && (
            <ResearchPanel
              technologies={gameState.technologies}
              knowledge={gameState.resources.knowledge}
              onUnlockTech={unlockTech}
            />
          )}

          {activeTab === 'economy' && (
            <AdvancedEconomyPanel
              resources={gameState.resources}
              inflation={gameState.inflation}
              population={gameState.population}
              season={gameState.time.season}
              taxRate={gameState.taxRate}
              debt={gameState.debt}
              defenseRating={gameState.defenseRating}
              onSetTaxRate={setTaxRate}
              onTakeLoan={takeLoan}
              onRepayDebt={repayDebt}
            />
          )}

           {activeTab === 'court' && (
             <CourtPanel 
               sovereign={gameState.sovereign}
               heir={gameState.heir}
               heirs={gameState.heirs}
               successionLaw={gameState.successionLaw}
               laws={gameState.laws}
               factions={gameState.factions}
               kingdoms={gameState.kingdoms}
               gold={gameState.resources.gold}
               onEnactLaw={enactLaw}
               onUpdateDiplomacy={updateDiplomacy}
               onStartDiplomaticMission={startDiplomaticMission}
             />
           )}
        </div>
      </div>

      {showSaveManager && (
        <SaveManager
          onSave={saveGame}
          onLoad={(slotId) => {
            loadGame(slotId);
            setShowSaveManager(false);
          }}
          onDelete={deleteSave}
          getSaveSlots={getSaveSlots}
          onClose={() => setShowSaveManager(false)}
        />
      )}
    </div>
  );
}

export default App;
