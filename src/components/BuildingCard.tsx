import React from 'react';
import type { BuildingType, Resources } from '../game/types';
import { BUILDINGS, BUILDING_CATEGORIES } from '../game/constants';
import { BUILDING_UPGRADES } from '../game/buildingUpgrades';

export { BUILDING_CATEGORIES };

interface BuildingCardProps {
  type: BuildingType;
  selected: boolean;
  resources: Resources;
  onSelect: (type: BuildingType) => void;
}

export function BuildingCard({ type, selected, resources, onSelect }: BuildingCardProps) {
  const building = BUILDINGS[type];
  const upgrades = BUILDING_UPGRADES[type];
  if (!building) return null;
  const canAfford = building.cost && Object.entries(building.cost).every(
    ([res, amount]) => resources[res as keyof Resources] >= amount
  );

  const level1Upgrade = upgrades[0];
  const level2Upgrade = upgrades[1];

  return (
    <div
      className={`b-card ${selected ? 'sel' : ''} ${!canAfford ? 'disabled' : ''}`}
      onClick={() => canAfford && onSelect(type)}
    >
      <strong>{building.name}</strong>
      <p className="b-desc">{building.description}</p>
      <div className="b-cost-row">
        {building.cost && Object.entries(building.cost).map(([res, amount]) => (
          <span
            key={res}
            className={resources[res as keyof Resources] < amount ? 'cost-missing' : ''}
          >
            {amount}{res[0].toUpperCase()}{' '}
          </span>
        ))}
      </div>
      {level2Upgrade?.cost && (
        <div className="b-upgrade-info">
          <small className="upgrade-label">Livello 2:</small>
          <div className="b-cost-row">
            {Object.entries(level2Upgrade.cost).map(([res, amount]) => (
              <span
                key={res}
                className={resources[res as keyof Resources] < amount ? 'cost-missing' : ''}
              >
                {amount}{res[0].toUpperCase()}
              </span>
            ))}
          </div>
          {level2Upgrade.description && (
            <small className="upgrade-benefit">{level2Upgrade.description}</small>
          )}
        </div>
      )}
    </div>
  );
}
