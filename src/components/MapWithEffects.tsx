import React, { useState } from 'react';
import { BUILDINGS } from '../game/constants';
import { BUILDING_UPGRADES } from '../game/buildingUpgrades';
import type { Building, BuildingType, Resources } from '../game/types';
import type { ResourceNode } from '../game/types';

interface MapWithEffectsProps {
  buildings: Building[];
  resourceNodes: ResourceNode[];
  selectedBuilding: BuildingType | null;
  mousePos: { x: number; y: number };
  canAfford: boolean;
  resources: Resources;
  onBuild: (type: BuildingType, x: number, y: number) => void;
  onAssignWorker: (id: string, delta: number) => void;
  onUpgradeBuilding: (id: string) => void;
  onMouseMove: (pos: { x: number; y: number }) => void;
}

const GRID_SIZE = 50;

export function MapWithEffects({
  buildings,
  resourceNodes,
  selectedBuilding,
  mousePos,
  canAfford,
  resources,
  onBuild,
  onAssignWorker,
  onUpgradeBuilding,
  onMouseMove
}: MapWithEffectsProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  return (
    <div className="game-map-wrapper">
      <div
        className="map-world"
        style={{ width: 2500, height: 2500 }}
        onClick={() => selectedBuilding && onBuild(selectedBuilding, mousePos.x, mousePos.y)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const scrollLeft = e.currentTarget.parentElement?.scrollLeft || 0;
          const scrollTop = e.currentTarget.parentElement?.scrollTop || 0;
          const x = Math.floor((e.clientX - rect.left + scrollLeft) / GRID_SIZE);
          const y = Math.floor((e.clientY - rect.top + scrollTop) / GRID_SIZE);
          onMouseMove({ x, y });
        }}
      >
        {/* Resource Nodes Layer */}
        <div className="layer-nodes">
          {resourceNodes.map(node => (
            <div
              key={node.id}
              className={`node ${node.type}`}
              style={{ left: node.x * GRID_SIZE, top: node.y * GRID_SIZE }}
            />
          ))}
        </div>
        
        {/* Buildings Layer */}
        <div className="layer-buildings">
          {buildings.map(building => {
            const upgrades = BUILDING_UPGRADES[building.type];
            const currentUpgrade = upgrades[building.level - 1];
            const nextLevel = building.level + 1;
            const nextUpgrade = nextLevel <= 5 ? upgrades[nextLevel - 1] : null;
            const canUpgrade = nextUpgrade?.cost && Object.entries(nextUpgrade.cost).every(
              ([res, amount]) => resources[res as keyof Resources] >= amount
            );
            
            return (
              <div
                key={building.id}
                className={`building ${building.type} ${selectedBuildingId === building.id ? 'selected' : ''}`}
                style={{ 
                  left: building.x * GRID_SIZE, 
                  top: building.y * GRID_SIZE,
                  animationDelay: `${building.x * 10}ms`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBuildingId(building.id);
                }}
              >
                <img 
                  src={`/assets/buildings/${building.type}.png`} 
                  alt={BUILDINGS[building.type].name}
                  className="building-img"
                />
                <div className="b-label">
                  {BUILDINGS[building.type].name}
                  <span className="b-level">Lv.{building.level}</span>
                </div>
                {BUILDINGS[building.type].maxWorkers > 0 && (
                  <div className="w-ctrl">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignWorker(building.id, -1);
                      }}
                    >
                      -
                    </button>
                    <span>{building.assignedWorkers}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignWorker(building.id, 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
                {nextUpgrade && selectedBuildingId === building.id && (
                  <button
                    className="btn-upgrade"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canUpgrade) onUpgradeBuilding(building.id);
                    }}
                    disabled={!canUpgrade}
                    title={nextUpgrade.description}
                  >
                    ⬆️
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Ghost Placement Preview */}
        {selectedBuilding && (
          <div
            className={`ghost ${canAfford ? 'valid' : 'invalid'}`}
            style={{ left: mousePos.x * GRID_SIZE, top: mousePos.y * GRID_SIZE }}
          />
        )}
      </div>
    </div>
  );
}
