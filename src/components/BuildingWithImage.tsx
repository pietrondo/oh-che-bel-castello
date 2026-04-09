import React from 'react';
import { BUILDINGS } from '../game/constants';
import type { BuildingType } from '../game/types';

interface BuildingWithImageProps {
  type: BuildingType;
  assignedWorkers: number;
  maxWorkers: number;
  onAssignWorker: (delta: number) => void;
}

const BUILDING_IMAGES: Record<BuildingType, string> = {
  keep: '/assets/keep-test.png',
  house: '/assets/house-test.png',
  farm: '/assets/farm-test.png',
  lumber_mill: '/assets/lumber_mill-test.png',
  stone_quarry: '/assets/stone_quarry-test.png',
  granary: '',
  barracks: '/assets/barracks-test.png',
  blacksmith: '/assets/blacksmith-test.png',
  iron_mine: '',
  market: '',
  manor: '',
  church: '/assets/church-test.png',
  university: '/assets/university-test.png',
  cathedral: '/assets/cathedral-test.png',
  road: '',
  wall: '',
  tower: '',
  well: '/assets/well-test.png',
  brewery: '',
  tailor: '',
  winery: '',
  jeweler: '',
  windmill: '/assets/windmill-test.png',
  bakery: '',
  sheep_farm: '',
  weaving_mill: ''
};

export function BuildingWithImage({ 
  type, 
  assignedWorkers, 
  maxWorkers, 
  onAssignWorker 
}: BuildingWithImageProps) {
  const building = BUILDINGS[type];
  const hasImage = BUILDING_IMAGES[type] && BUILDING_IMAGES[type] !== '';
  
  return (
    <div className={`building ${type}`}>
      {hasImage ? (
        <img 
          src={BUILDING_IMAGES[type]} 
          alt={building.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        <>{building.name.charAt(0)}</>
      )}
      
      {maxWorkers > 0 && (
        <div className="w-ctrl">
          <button onClick={() => onAssignWorker(-1)}>-</button>
          <span>{assignedWorkers}</span>
          <button onClick={() => onAssignWorker(1)}>+</button>
        </div>
      )}
    </div>
  );
}
