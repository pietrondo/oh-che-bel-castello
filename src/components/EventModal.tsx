import React from 'react';
import type { GameEvent, Resources } from '../game/types';

interface EventModalProps {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
  onClose: () => void;
  resources: Resources;
  defenseRating: number;
}

export function EventModal({ event, onChoose, onClose, resources, defenseRating }: EventModalProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      positive: 'linear-gradient(135deg, #4caf50, #2e7d32)',
      negative: 'linear-gradient(135deg, #f44336, #c62828)',
      neutral: 'linear-gradient(135deg, #2196f3, #1565c0)',
      crisis: 'linear-gradient(135deg, #ff5722, #bf360c)',
      opportunity: 'linear-gradient(135deg, #ff9800, #f57c00)'
    };
    return colors[type] || colors.neutral;
  };

  const canAffordChoice = (choice: any) => {
    if (!choice.requirements) return true;
    
    return Object.entries(choice.requirements).every(([key, value]) => {
      const numValue = Number(value);
      if (key === 'gold') return resources.gold >= numValue;
      if (key === 'knowledge') return resources.knowledge >= numValue;
      if (key === 'piety') return resources.piety >= numValue;
      if (key === 'prestige') return resources.prestige >= numValue;
      if (key === 'defense') return defenseRating >= numValue;
      if (key in resources) return resources[key as keyof Resources] >= numValue;
      return true;
    });
  };

  const getEffectPreview = (choice: any) => {
    const effects: string[] = [];
    
    if (choice.effects?.resources) {
      Object.entries(choice.effects.resources).forEach(([key, value]) => {
        const numValue = value as number;
        effects.push(`${numValue > 0 ? '+' : ''}${numValue} ${key}`);
      });
    }
    
    if (choice.effects?.happiness) {
      effects.push(`${choice.effects.happiness > 0 ? '+' : ''}${choice.effects.happiness} felicità`);
    }
    
    if (choice.effects?.health) {
      effects.push(`${choice.effects.health > 0 ? '+' : ''}${choice.effects.health} salute`);
    }
    
    if (choice.effects?.population) {
      effects.push(`${choice.effects.population > 0 ? '+' : ''}${choice.effects.population} popolazione`);
    }
    
    if (choice.effects?.defense) {
      effects.push(`${choice.effects.defense > 0 ? '+' : ''}${choice.effects.defense} difesa`);
    }
    
    return effects.join(', ');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.3s ease-out'
    }}
    onClick={onClose}
    >
      <div 
        style={{
          background: '#fff',
          borderRadius: '15px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'slideInUp 0.4s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: getTypeColor(event.type),
          padding: '30px',
          borderRadius: '15px 15px 0 0',
          textAlign: 'center',
          color: '#fff'
        }}>
          <div style={{ fontSize: '4em', marginBottom: '10px' }}>{event.image || '📜'}</div>
          <h2 style={{ 
            fontFamily: 'MedievalSharp', 
            fontSize: '1.8em',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {event.title}
          </h2>
          <p style={{ 
            fontSize: '1.1em', 
            margin: 0,
            opacity: 0.95,
            lineHeight: 1.5
          }}>
            {event.description}
          </p>
        </div>

        {/* Choices */}
        {event.choices && event.choices.length > 0 && (
          <div style={{ padding: '25px' }}>
            <h3 style={{ 
              fontFamily: 'MedievalSharp', 
              marginBottom: '20px',
              color: '#333',
              fontSize: '1.3em'
            }}>
              Cosa fai?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {event.choices.map(choice => {
                const affordable = canAffordChoice(choice);
                
                return (
                  <button
                    key={choice.id}
                    onClick={() => onChoose(choice.id)}
                    disabled={!affordable}
                    style={{
                      padding: '20px',
                      background: affordable ? '#fff' : '#f5f5f5',
                      border: `3px solid ${affordable ? '#c9a227' : '#bdbdbd'}`,
                      borderRadius: '10px',
                      cursor: affordable ? 'pointer' : 'not-allowed',
                      opacity: affordable ? 1 : 0.6,
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      if (affordable) {
                        e.currentTarget.style.background = '#fffbf0';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = affordable ? '#fff' : '#f5f5f5';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontFamily: 'MedievalSharp',
                      fontSize: '1.1em',
                      color: '#333',
                      marginBottom: '5px'
                    }}>
                      {choice.text}
                    </div>
                    {choice.description && (
                      <div style={{ 
                        fontSize: '0.9em', 
                        color: '#666',
                        marginBottom: '10px'
                      }}>
                        {choice.description}
                      </div>
                    )}
                    {choice.requirements && (
                      <div style={{ 
                        fontSize: '0.8em', 
                        color: '#f57c00',
                        marginBottom: '8px',
                        fontStyle: 'italic'
                      }}>
                        Requisiti: {Object.entries(choice.requirements).map(([key, value]) => `${value} ${key}`).join(', ')}
                      </div>
                    )}
                    <div style={{ 
                      fontSize: '0.85em', 
                      color: affordable ? '#4caf50' : '#f44336',
                      fontWeight: 'bold'
                    }}>
                      Effetti: {getEffectPreview(choice)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Close button for events without choices */}
        {!event.choices && (
          <div style={{ padding: '25px', textAlign: 'center' }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 30px',
                background: '#c9a227',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'MedievalSharp',
                fontSize: '1em',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Comprendo
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
