import React from 'react';
import { BUILDINGS } from '../game/constants';
import type { Building, ResourceNode, BuildingType } from '../game/types';

interface GameMapProps {
  buildings: Building[];
  resourceNodes: ResourceNode[];
  selectedBuilding: BuildingType | null;
  mousePos: { x: number; y: number };
  canAfford: boolean;
  onBuild: (type: BuildingType, x: number, y: number) => void;
  onAssignWorker: (id: string, delta: number) => void;
}

const GRID_SIZE = 50;

export function GameMap({
  buildings,
  resourceNodes,
  selectedBuilding,
  mousePos,
  canAfford,
  onBuild,
  onAssignWorker
}: GameMapProps) {
  return (
    <div className="game-map-wrapper">
      <div
        className="map-world"
        style={{ width: 2500, height: 2500 }}
        onClick={() => selectedBuilding && onBuild(selectedBuilding, mousePos.x, mousePos.y)}
      >
        {resourceNodes.map(node => (
          <div
            key={node.id}
            className={`node ${node.type}`}
            style={{ left: node.x * GRID_SIZE, top: node.y * GRID_SIZE }}
          />
        ))}
        
        {buildings.map(building => (
          <div
            key={building.id}
            className={`building ${building.type}`}
            style={{ left: building.x * GRID_SIZE, top: building.y * GRID_SIZE }}
          >
            <div className="b-label">{BUILDINGS[building.type].name}</div>
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
          </div>
        ))}
        
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
