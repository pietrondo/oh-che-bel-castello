import { useState } from 'react';
import './App.css';
import { useGameEngine } from './game/useGameEngine';
import { BUILDINGS } from './game/constants';
import { HUD, SidebarNav, BuildingSidebar, ResearchPanel, EconomyPanel, CourtPanel, MapWithEffects, NotificationSystem, useGameNotifications } from './components';
import type { BuildingType, Resources } from './game/types';

const GRID_SIZE = 50;

function App() {
  const { gameState, buildBuilding, assignWorker, unlockTech, resetGame } = useGameEngine();
  const { notifications, dismissNotification } = useGameNotifications();
  const [activeTab, setActiveTab] = useState<'map' | 'research' | 'economy' | 'court'>('map');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canAfford = (cost: Partial<Resources>) => {
      return Object.entries(cost).every(([r, a]) => gameState.resources[r as keyof Resources] >= (a as number));
  };

  return (
    <div className="game-container">
      <HUD 
        resources={gameState.resources}
        population={gameState.population}
        defenseRating={gameState.defenseRating}
        year={gameState.time.year}
      />

      <NotificationSystem 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />

      <div className="main-layout">
        <SidebarNav 
          activeTab={activeTab}
          onTabChange={(tab: string) => setActiveTab(tab as 'map' | 'research' | 'economy' | 'court')}
          onReset={resetGame}
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
                onBuild={buildBuilding}
                onAssignWorker={assignWorker}
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
            <EconomyPanel
              resources={gameState.resources}
              inflation={gameState.inflation}
              population={gameState.population}
            />
          )}

          {activeTab === 'court' && (
            <CourtPanel sovereign={gameState.sovereign} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
