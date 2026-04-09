import React from 'react';
import type { BuildingType, Resources } from '../game/types';
import { BUILDINGS, BUILDING_CATEGORIES } from '../game/constants';

export { BUILDING_CATEGORIES };

interface BuildingCardProps {
  type: BuildingType;
  selected: boolean;
  resources: Resources;
  onSelect: (type: BuildingType) => void;
}

export function BuildingCard({ type, selected, resources, onSelect }: BuildingCardProps) {
  const building = BUILDINGS[type];
  if (!building) return null;
  const canAfford = building.cost && Object.entries(building.cost).every(
    ([res, amount]) => resources[res as keyof Resources] >= amount
  );

  return (
    <div
      className={`b-card ${selected ? 'sel' : ''} ${!canAfford ? 'disabled' : ''}`}
      onClick={() => canAfford && onSelect(type)}
    >
      <strong>{building.name}</strong>
      <p className="b-desc">{building.description}</p>
      <div className="b-cost-row">
        {Object.entries(building.cost).map(([res, amount]) => (
          <span
            key={res}
            className={resources[res as keyof Resources] < amount ? 'cost-missing' : ''}
          >
            {amount}{res[0].toUpperCase()}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
