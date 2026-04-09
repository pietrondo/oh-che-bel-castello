import { useState, useEffect, useRef } from 'react';
import type { GameState, BuildingType, Resources, ResourceType, Dialogue, DialogueOption } from './types';
import { INITIAL_STATE, BUILDINGS } from './constants';

const TICK_RATE = 1000;
const SAVE_KEY = 'feudal_lord_grand_v3';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, activeDialogue: null, lastDialogueResult: null };
      } catch (e) { return INITIAL_STATE; }
    }
    return INITIAL_STATE;
  });

  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    let animationFrameId: number;
    const tick = (time: number) => {
      if (time - lastTickRef.current >= TICK_RATE) {
        setGameState((prevState) => updateGameState(prevState));
        lastTickRef.current = time;
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const updateGameState = (state: GameState): GameState => {
    if (state.activeDialogue) return state;

    const nextTime = { ...state.time, tick: state.time.tick + 1 };
    
    // Time Advancement
    if (nextTime.tick >= 10) {
      nextTime.tick = 0;
      nextTime.day += 1;
      if (nextTime.day > 30) {
        nextTime.day = 1;
        nextTime.month += 1;
        if (nextTime.month > 12) { nextTime.month = 1; nextTime.year += 1; }
      }
    }

    const nextResources = { ...state.resources };
    
    // Technology Bonuses
    const hasCropRotation = state.technologies.find(t => t.id === 'crop_rotation')?.unlocked;
    const hasMining = state.technologies.find(t => t.id === 'mining')?.unlocked;
    const productivityMod = (state.population.happiness / 100);

    // Production Logic
    state.buildings.forEach((b) => {
      const data = BUILDINGS[b.type];
      const workRatio = data.maxWorkers > 0 ? b.assignedWorkers / data.maxWorkers : 1;
      if (workRatio <= 0 && data.maxWorkers > 0) return;

      if (data.production) {
        Object.entries(data.production).forEach(([res, amount]) => {
          let final = (amount as number) * workRatio * productivityMod;
          if (res === 'food' && hasCropRotation) final *= 1.25;
          if ((res === 'iron' || res === 'stone') && hasMining) final *= 1.3;
          nextResources[res as keyof Resources] += final;
        });
      }
      if (data.consumption) {
          Object.entries(data.consumption).forEach(([res, amount]) => {
              nextResources[res as keyof Resources] -= (amount as number) * workRatio;
          });
      }
    });

    // Consumption & Social
    const foodCons = (state.population.peasants * 0.4) + (state.population.citizens * 0.6) + (state.population.nobles * 1.0);
    nextResources.food = Math.max(0, nextResources.food - foodCons);

    // Social Evolution
    const nextPop = { ...state.population };
    if (state.population.happiness > 90 && nextResources.food > 200 && Math.random() > 0.98) {
        nextPop.peasants += 1;
        nextPop.total += 1;
    }

    // Dialogue Triggers
    let nextDialogue: Dialogue | null = null;
    if (nextResources.food <= 0 && Math.random() > 0.9) {
        nextDialogue = {
            id: 'famine', speaker: 'Alaric', portrait: '👴', text: 'Signore, non abbiamo più cibo!',
            options: [
                { text: 'Compra cibo (50 Oro)', resultText: 'Cibo acquistato.', effect: (s) => ({ resources: { ...s.resources, gold: s.resources.gold - 50, food: 100 } }) },
                { text: 'Lasciali soffrire', resultText: 'Il popolo è furioso.', effect: (s) => ({ population: { ...s.population, happiness: s.population.happiness - 20 } }) }
            ]
        };
    }

    return { ...state, time: nextTime, resources: nextResources, population: nextPop, activeDialogue: nextDialogue };
  };

  const buildBuilding = (type: BuildingType, x: number, y: number) => {
    const data = BUILDINGS[type];
    const canAfford = Object.entries(data.cost).every(([r, a]) => gameState.resources[r as keyof Resources] >= (a as number));
    const isOccupied = gameState.buildings.some(b => b.x === x && b.y === y);
    const nodeOk = !data.requiresNode || gameState.resourceNodes.some(n => n.type === data.requiresNode && n.x === x && n.y === y);
    const mountainCheck = !gameState.resourceNodes.some(n => n.type === 'mountain' && n.x === x && n.y === y);

    if (canAfford && !isOccupied && nodeOk && mountainCheck) {
        setGameState(prev => {
            const nr = { ...prev.resources };
            Object.entries(data.cost).forEach(([r, a]) => nr[r as keyof Resources] -= (a as number));
            return { ...prev, resources: nr, buildings: [...prev.buildings, { id: Math.random().toString(), type, x, y, level: 1, assignedWorkers: 0 }] };
        });
    }
  };

  const resolveDialogue = (idx: number) => {
      if (!gameState.activeDialogue) return;
      const opt = gameState.activeDialogue.options[idx];
      setGameState(prev => ({ ...prev, ...opt.effect(prev), activeDialogue: null, lastDialogueResult: opt.resultText }));
      setTimeout(() => setGameState(prev => ({ ...prev, lastDialogueResult: null })), 3000);
  };

  return { 
      gameState, buildBuilding, resolveDialogue,
      assignWorker: (id: string, amt: number) => {
          setGameState(prev => ({
              ...prev,
              buildings: prev.buildings.map(b => b.id === id ? { ...b, assignedWorkers: Math.max(0, Math.min(BUILDINGS[b.type].maxWorkers, b.assignedWorkers + amt)) } : b)
          }));
      },
      resetGame: () => { 
          localStorage.removeItem(SAVE_KEY); 
          window.location.reload(); 
      } 
  };
}
