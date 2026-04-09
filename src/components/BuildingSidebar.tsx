import React, { useState } from 'react';
import { BuildingCard, BUILDING_CATEGORIES } from './BuildingCard';
import type { BuildingType, Resources } from '../game/types';

interface BuildingSidebarProps {
  selectedBuilding: BuildingType | null;
  resources: Resources;
  onSelectBuilding: (type: BuildingType) => void;
}

export function BuildingSidebar({ selectedBuilding, resources, onSelectBuilding }: BuildingSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Base');

  return (
    <div className="map-sidebar">
      <h2 className="sidebar-title">Costruzioni</h2>
      <div className="category-tabs">
        {Object.keys(BUILDING_CATEGORIES).map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="b-list scrollable">
        {BUILDING_CATEGORIES[activeCategory as keyof typeof BUILDING_CATEGORIES].map(bKey => (
          <BuildingCard
            key={bKey}
            type={bKey as BuildingType}
            selected={selectedBuilding === bKey}
            resources={resources}
            onSelect={onSelectBuilding}
          />
        ))}
      </div>
    </div>
  );
}
