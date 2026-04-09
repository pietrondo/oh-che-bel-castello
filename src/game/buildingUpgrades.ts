import type { BuildingType, Resources } from './types';

export interface BuildingUpgrade {
  level: number;
  cost?: Partial<Resources>;
  productionMultiplier?: number;
  consumptionMultiplier?: number;
  populationProvidedBonus?: number;
  maxWorkersBonus?: number;
  description?: string;
}

export const BUILDING_UPGRADES: Record<BuildingType, BuildingUpgrade[]> = {
  // Base
  house: [
    { level: 1, description: 'Casa semplice' },
    { level: 2, cost: { wood: 30 }, populationProvidedBonus: 2, description: '+2 popolazione' },
    { level: 3, cost: { wood: 45, stone: 20 }, populationProvidedBonus: 4, description: '+6 popolazione totale' },
    { level: 4, cost: { wood: 60, stone: 40, gold: 30 }, populationProvidedBonus: 6, description: '+12 popolazione totale' },
    { level: 5, cost: { wood: 80, stone: 60, gold: 60 }, populationProvidedBonus: 8, description: '+20 popolazione totale' }
  ],
  farm: [
    { level: 1, description: 'Fattoria base' },
    { level: 2, cost: { wood: 20 }, productionMultiplier: 1.3, description: '+30% produzione grano' },
    { level: 3, cost: { wood: 35, stone: 15 }, productionMultiplier: 1.7, description: '+70% produzione grano' },
    { level: 4, cost: { wood: 50, stone: 30, gold: 25 }, productionMultiplier: 2.2, description: '+120% produzione grano' },
    { level: 5, cost: { wood: 70, stone: 50, gold: 50 }, productionMultiplier: 2.8, description: '+180% produzione grano' }
  ],
  lumber_mill: [
    { level: 1, description: 'Segheria base' },
    { level: 2, cost: { wood: 20, stone: 15 }, productionMultiplier: 1.4, description: '+40% produzione legno' },
    { level: 3, cost: { wood: 35, stone: 25 }, productionMultiplier: 1.9, description: '+90% produzione legno' },
    { level: 4, cost: { wood: 55, stone: 45, gold: 35 }, productionMultiplier: 2.5, description: '+150% produzione legno' },
    { level: 5, cost: { wood: 80, stone: 70, gold: 70 }, productionMultiplier: 3.2, description: '+220% produzione legno' }
  ],
  stone_quarry: [
    { level: 1, description: 'Cava base' },
    { level: 2, cost: { wood: 25 }, productionMultiplier: 1.3, description: '+30% produzione pietra' },
    { level: 3, cost: { wood: 40, stone: 20 }, productionMultiplier: 1.8, description: '+80% produzione pietra' },
    { level: 4, cost: { wood: 60, stone: 40, gold: 30 }, productionMultiplier: 2.4, description: '+140% produzione pietra' },
    { level: 5, cost: { wood: 85, stone: 65, gold: 60 }, productionMultiplier: 3.1, description: '+210% produzione pietra' }
  ],
  well: [
    { level: 1, description: 'Pozzo semplice' },
    { level: 2, cost: { stone: 25 }, populationProvidedBonus: 4, description: '+4 salute popolazione' },
    { level: 3, cost: { stone: 45, gold: 20 }, populationProvidedBonus: 8, description: '+12 salute popolazione' },
    { level: 4, cost: { stone: 70, gold: 40 }, populationProvidedBonus: 12, description: '+24 salute popolazione' },
    { level: 5, cost: { stone: 100, gold: 75 }, populationProvidedBonus: 16, description: '+40 salute popolazione' }
  ],
  road: [
    { level: 1, description: 'Strada sterrata' },
    { level: 2, cost: { wood: 6 }, populationProvidedBonus: 2, description: '+2 felicità' },
    { level: 3, cost: { wood: 10, stone: 5 }, populationProvidedBonus: 5, description: '+7 felicità' },
    { level: 4, cost: { wood: 15, stone: 12 }, populationProvidedBonus: 8, description: '+15 felicità' },
    { level: 5, cost: { wood: 20, stone: 20, gold: 15 }, populationProvidedBonus: 12, description: '+27 felicità' }
  ],

  // Industria
  windmill: [
    { level: 1, description: 'Mulino base' },
    { level: 2, cost: { wood: 30, stone: 20 }, productionMultiplier: 1.4, consumptionMultiplier: 1.2, description: '+40% farina, +20% grano usato' },
    { level: 3, cost: { wood: 50, stone: 35 }, productionMultiplier: 1.9, consumptionMultiplier: 1.5, description: '+90% farina, +50% grano usato' },
    { level: 4, cost: { wood: 75, stone: 60, gold: 40 }, productionMultiplier: 2.5, consumptionMultiplier: 1.9, description: '+150% farina, +90% grano usato' },
    { level: 5, cost: { wood: 100, stone: 90, gold: 80 }, productionMultiplier: 3.2, consumptionMultiplier: 2.4, description: '+220% farina, +140% grano usato' }
  ],
  bakery: [
    { level: 1, description: 'Forno base' },
    { level: 2, cost: { stone: 40, gold: 25 }, productionMultiplier: 1.3, consumptionMultiplier: 1.1, description: '+30% pane, +10% farina usata' },
    { level: 3, cost: { stone: 65, gold: 45 }, productionMultiplier: 1.7, consumptionMultiplier: 1.3, description: '+70% pane, +30% farina usata' },
    { level: 4, cost: { stone: 95, gold: 75 }, productionMultiplier: 2.2, consumptionMultiplier: 1.6, description: '+120% pane, +60% farina usata' },
    { level: 5, cost: { stone: 130, gold: 120 }, productionMultiplier: 2.8, consumptionMultiplier: 2.0, description: '+180% pane, +100% farina usata' }
  ],
  iron_mine: [
    { level: 1, description: 'Miniera base' },
    { level: 2, cost: { wood: 30, stone: 20 }, productionMultiplier: 1.4, description: '+40% ferro' },
    { level: 3, cost: { wood: 50, stone: 40 }, productionMultiplier: 1.9, description: '+90% ferro' },
    { level: 4, cost: { wood: 75, stone: 65, gold: 50 }, productionMultiplier: 2.5, description: '+150% ferro' },
    { level: 5, cost: { wood: 105, stone: 95, gold: 90 }, productionMultiplier: 3.2, description: '+220% ferro' }
  ],
  blacksmith: [
    { level: 1, description: 'Fabbro base' },
    { level: 2, cost: { wood: 25, stone: 25, gold: 35 }, productionMultiplier: 1.3, consumptionMultiplier: 1.1, description: '+30% attrezzi, +10% materie prime' },
    { level: 3, cost: { wood: 45, stone: 45, gold: 60 }, productionMultiplier: 1.7, consumptionMultiplier: 1.3, description: '+70% attrezzi, +30% materie prime' },
    { level: 4, cost: { wood: 70, stone: 70, gold: 95 }, productionMultiplier: 2.2, consumptionMultiplier: 1.6, description: '+120% attrezzi, +60% materie prime' },
    { level: 5, cost: { wood: 100, stone: 100, gold: 140 }, productionMultiplier: 2.8, consumptionMultiplier: 2.0, description: '+180% attrezzi, +100% materie prime' }
  ],
  brewery: [
    { level: 1, description: 'Birrificio base' },
    { level: 2, cost: { wood: 40, gold: 45 }, productionMultiplier: 1.3, description: '+30% birra' },
    { level: 3, cost: { wood: 65, gold: 75 }, productionMultiplier: 1.7, description: '+70% birra' },
    { level: 4, cost: { wood: 95, gold: 115 }, productionMultiplier: 2.2, description: '+120% birra' },
    { level: 5, cost: { wood: 130, gold: 170 }, productionMultiplier: 2.8, description: '+180% birra' }
  ],
  tailor: [
    { level: 1, description: 'Sartoria base' },
    { level: 2, cost: { gold: 60, tools: 2 }, productionMultiplier: 1.3, description: '+30% vestiti' },
    { level: 3, cost: { gold: 90, tools: 3 }, productionMultiplier: 1.7, description: '+70% vestiti' },
    { level: 4, cost: { gold: 130, tools: 5 }, productionMultiplier: 2.2, description: '+120% vestiti' },
    { level: 5, cost: { gold: 180, tools: 8 }, productionMultiplier: 2.8, description: '+180% vestiti' }
  ],
  granary: [
    { level: 1, description: 'Granaio base' },
    { level: 2, cost: { wood: 25, stone: 15 }, maxWorkersBonus: 2, description: '+2 lavoratori, conserva più cibo' },
    { level: 3, cost: { wood: 45, stone: 30 }, maxWorkersBonus: 4, description: '+6 lavoratori, conserva molto più cibo' },
    { level: 4, cost: { wood: 70, stone: 50, gold: 35 }, maxWorkersBonus: 6, description: '+12 lavoratori, conserva molto più cibo' },
    { level: 5, cost: { wood: 100, stone: 75, gold: 70 }, maxWorkersBonus: 8, description: '+20 lavoratori, conserva massimo cibo' }
  ],
  market: [
    { level: 1, description: 'Mercato base' },
    { level: 2, cost: { wood: 35, gold: 25 }, productionMultiplier: 1.4, maxWorkersBonus: 1, description: '+40% oro, +1 lavoratore' },
    { level: 3, cost: { wood: 55, gold: 45 }, productionMultiplier: 1.9, maxWorkersBonus: 2, description: '+90% oro, +3 lavoratori' },
    { level: 4, cost: { wood: 80, gold: 75 }, productionMultiplier: 2.5, maxWorkersBonus: 3, description: '+150% oro, +6 lavoratori' },
    { level: 5, cost: { wood: 110, gold: 115 }, productionMultiplier: 3.2, maxWorkersBonus: 4, description: '+220% oro, +10 lavoratori' }
  ],
  winery: [
    { level: 1, description: 'Vigneto base' },
    { level: 2, cost: { wood: 30, gold: 20 }, productionMultiplier: 1.3, description: '+30% vino' },
    { level: 3, cost: { wood: 50, gold: 35 }, productionMultiplier: 1.7, description: '+70% vino' },
    { level: 4, cost: { wood: 75, gold: 55 }, productionMultiplier: 2.2, description: '+120% vino' },
    { level: 5, cost: { wood: 105, gold: 85 }, productionMultiplier: 2.8, description: '+180% vino' }
  ],
  jeweler: [
    { level: 1, description: 'Gioielliere base' },
    { level: 2, cost: { gold: 90, tools: 4 }, productionMultiplier: 1.3, description: '+30% gioielli' },
    { level: 3, cost: { gold: 135, tools: 6 }, productionMultiplier: 1.7, description: '+70% gioielli' },
    { level: 4, cost: { gold: 190, tools: 10 }, productionMultiplier: 2.2, description: '+120% gioielli' },
    { level: 5, cost: { gold: 250, tools: 15 }, productionMultiplier: 2.8, description: '+180% gioielli' }
  ],
  sheep_farm: [
    { level: 1, description: 'Allevamento base' },
    { level: 2, cost: { wood: 20 }, productionMultiplier: 1.3, description: '+30% lana' },
    { level: 3, cost: { wood: 35, stone: 15 }, productionMultiplier: 1.7, description: '+70% lana' },
    { level: 4, cost: { wood: 55, stone: 30, gold: 25 }, productionMultiplier: 2.2, description: '+120% lana' },
    { level: 5, cost: { wood: 80, stone: 50, gold: 50 }, productionMultiplier: 2.8, description: '+180% lana' }
  ],
  weaving_mill: [
    { level: 1, description: 'Tessitoria base' },
    { level: 2, cost: { wood: 35, gold: 15 }, productionMultiplier: 1.4, consumptionMultiplier: 1.2, description: '+40% tessuto, +20% lana usata' },
    { level: 3, cost: { wood: 55, gold: 25 }, productionMultiplier: 1.9, consumptionMultiplier: 1.5, description: '+90% tessuto, +50% lana usata' },
    { level: 4, cost: { wood: 80, gold: 40 }, productionMultiplier: 2.5, consumptionMultiplier: 1.9, description: '+150% tessuto, +90% lana usata' },
    { level: 5, cost: { wood: 110, gold: 65 }, productionMultiplier: 3.2, consumptionMultiplier: 2.4, description: '+220% tessuto, +140% lana usata' }
  ],

  // Corte
  keep: [
    { level: 1, description: 'Mastio Reale base' },
    { level: 2, cost: { gold: 200, stone: 150 }, productionMultiplier: 1.3, populationProvidedBonus: 4, description: '+30% risorse, +4 popolazione' },
    { level: 3, cost: { gold: 350, stone: 250 }, productionMultiplier: 1.7, populationProvidedBonus: 8, description: '+70% risorse, +12 popolazione' },
    { level: 4, cost: { gold: 550, stone: 400 }, productionMultiplier: 2.2, populationProvidedBonus: 12, description: '+120% risorse, +24 popolazione' },
    { level: 5, cost: { gold: 800, stone: 600 }, productionMultiplier: 2.8, populationProvidedBonus: 16, description: '+180% risorse, +40 popolazione' }
  ],
  barracks: [
    { level: 1, description: 'Caserma base' },
    { level: 2, cost: { stone: 60, gold: 45 }, maxWorkersBonus: 2, description: '+2 soldati, -1 oro/tick' },
    { level: 3, cost: { stone: 100, gold: 75 }, maxWorkersBonus: 4, description: '+6 soldati, -2 oro/tick' },
    { level: 4, cost: { stone: 150, gold: 115 }, maxWorkersBonus: 6, description: '+12 soldati, -3 oro/tick' },
    { level: 5, cost: { stone: 210, gold: 165 }, maxWorkersBonus: 8, description: '+20 soldati, -4 oro/tick' }
  ],
  university: [
    { level: 1, description: 'Università base' },
    { level: 2, cost: { stone: 90, gold: 95 }, productionMultiplier: 1.4, maxWorkersBonus: 1, description: '+40% conoscenza, +1 studioso' },
    { level: 3, cost: { stone: 140, gold: 145 }, productionMultiplier: 1.9, maxWorkersBonus: 2, description: '+90% conoscenza, +3 studiosi' },
    { level: 4, cost: { stone: 200, gold: 205 }, productionMultiplier: 2.5, maxWorkersBonus: 3, description: '+150% conoscenza, +6 studiosi' },
    { level: 5, cost: { stone: 270, gold: 275 }, productionMultiplier: 3.2, maxWorkersBonus: 4, description: '+220% conoscenza, +10 studiosi' }
  ],
  church: [
    { level: 1, description: 'Chiesa base' },
    { level: 2, cost: { stone: 45, wood: 25 }, productionMultiplier: 1.3, maxWorkersBonus: 1, description: '+30% pietà, +1 chierico' },
    { level: 3, cost: { stone: 70, wood: 40 }, productionMultiplier: 1.7, maxWorkersBonus: 1, description: '+70% pietà, +2 chierici' },
    { level: 4, cost: { stone: 100, wood: 60 }, productionMultiplier: 2.2, maxWorkersBonus: 2, description: '+120% pietà, +4 chierici' },
    { level: 5, cost: { stone: 140, wood: 85 }, productionMultiplier: 2.8, maxWorkersBonus: 2, description: '+180% pietà, +6 chierici' }
  ],
  cathedral: [
    { level: 1, description: 'Cattedrale base' },
    { level: 2, cost: { stone: 350, gold: 450 }, productionMultiplier: 1.3, maxWorkersBonus: 2, description: '+30% pietà/prestigio, +2 operai' },
    { level: 3, cost: { stone: 550, gold: 700 }, productionMultiplier: 1.7, maxWorkersBonus: 3, description: '+70% pietà/prestigio, +5 operai' },
    { level: 4, cost: { stone: 800, gold: 1000 }, productionMultiplier: 2.2, maxWorkersBonus: 4, description: '+120% pietà/prestigio, +9 operai' },
    { level: 5, cost: { stone: 1100, gold: 1400 }, productionMultiplier: 2.8, maxWorkersBonus: 5, description: '+180% pietà/prestigio, +14 operai' }
  ],
  manor: [
    { level: 1, description: 'Maniero base' },
    { level: 2, cost: { stone: 180, gold: 130 }, populationProvidedBonus: 4, maxWorkersBonus: 1, description: '+4 nobili, +1 servitore' },
    { level: 3, cost: { stone: 280, gold: 200 }, populationProvidedBonus: 8, maxWorkersBonus: 2, description: '+12 nobili, +3 servitori' },
    { level: 4, cost: { stone: 400, gold: 290 }, populationProvidedBonus: 12, maxWorkersBonus: 3, description: '+24 nobili, +6 servitori' },
    { level: 5, cost: { stone: 550, gold: 400 }, populationProvidedBonus: 16, maxWorkersBonus: 4, description: '+40 nobili, +10 servitori' }
  ],
  wall: [
    { level: 1, description: 'Mura base' },
    { level: 2, cost: { stone: 15 }, populationProvidedBonus: 5, description: '+5 difesa' },
    { level: 3, cost: { stone: 25 }, populationProvidedBonus: 12, description: '+17 difesa' },
    { level: 4, cost: { stone: 40 }, populationProvidedBonus: 20, description: '+37 difesa' },
    { level: 5, cost: { stone: 60 }, populationProvidedBonus: 30, description: '+67 difesa' }
  ],
  tower: [
    { level: 1, description: 'Torre base' },
    { level: 2, cost: { stone: 60 }, productionMultiplier: 1.3, maxWorkersBonus: 1, description: '+30% difesa, +1 guardia' },
    { level: 3, cost: { stone: 95 }, productionMultiplier: 1.7, maxWorkersBonus: 1, description: '+70% difesa, +2 guardie' },
    { level: 4, cost: { stone: 140 }, productionMultiplier: 2.2, maxWorkersBonus: 2, description: '+120% difesa, +4 guardie' },
    { level: 5, cost: { stone: 195 }, productionMultiplier: 2.8, maxWorkersBonus: 2, description: '+180% difesa, +6 guardie' }
  ]
};