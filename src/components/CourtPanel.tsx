import React from 'react';
import type { Sovereign, Law, Faction, Kingdom, DiplomaticMission } from '../game/types';

interface CourtPanelProps {
  sovereign: Sovereign;
  heir: Sovereign;
  laws: Law[];
  factions: Faction[];
  kingdoms: Kingdom[];
  gold: number;
  onEnactLaw: (id: string) => void;
  onUpdateDiplomacy: (kingdom: string, delta: number) => void;
}

export function CourtPanel({ 
  sovereign, 
  heir, 
  laws, 
  factions, 
  kingdoms,
  gold,
  onEnactLaw,
  onUpdateDiplomacy
}: CourtPanelProps) {
  const getFavorColor = (favor: number) => {
    if (favor >= 50) return '#4caf50';
    if (favor <= -50) return '#f44336';
    return '#ff9800';
  };

  const getRelationsColor = (relations: number) => {
    if (relations >= 60) return '#4caf50';
    if (relations <= -30) return '#f44336';
    return '#ff9800';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      peace: '#4caf50',
      war: '#f44336',
      alliance: '#2196f3',
      trade: '#ff9800'
    };
    const labels: Record<string, string> = {
      peace: 'Pace',
      war: 'Guerra',
      alliance: 'Alleanza',
      trade: 'Commercio'
    };
    return (
      <span style={{ 
        background: colors[status] || '#999', 
        padding: '2px 8px', 
        borderRadius: '3px',
        fontSize: '0.8em',
        fontWeight: 'bold'
      }}>
        {labels[status] || status}
      </span>
    );
  };

  const getMissionIcon = (type: string) => {
    const icons: Record<string, string> = { trade: '🐫', military: '⚔️', cultural: '🎭', aid: '🤝' };
    return icons[type] || '📜';
  };

  return (
    <div className="panel-view">
      <h2 className="panel-title">La Corte Reale</h2>
      
      {/* Sovereign & Heir */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div className="sovereign-card">
          <div className="portrait-large">{sovereign.portrait}</div>
          <div className="sovereign-details">
            <h3>{sovereign.name}</h3>
            <p>Età: {sovereign.age} anni</p>
            <p>Tratti: {sovereign.traits?.join(', ') || 'Nessuno'}</p>
          </div>
        </div>
        
        <div className="sovereign-card">
          <div className="portrait-large" style={{ fontSize: '40px' }}>{heir.portrait}</div>
          <div className="sovereign-details">
            <h3>{heir.name}</h3>
            <p>Età: {heir.age} anni</p>
            <p>Erede al trono</p>
          </div>
        </div>
      </div>

      {/* Factions */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#c9a227' }}>Fazioni del Regno</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {factions.map(faction => (
            <div key={faction.type} style={{
              background: '#fff',
              border: '2px solid #263238',
              padding: '20px',
              borderRadius: '10px',
              minWidth: '250px',
              flex: '1',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ fontFamily: 'MedievalSharp', marginBottom: '10px' }}>{faction.name}</h4>
              <p style={{ fontSize: '0.9em', color: '#666' }}>Bonus: {faction.bonus}</p>
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Favore</span>
                  <span style={{ fontWeight: 'bold', color: getFavorColor(faction.favor) }}>{faction.favor}%</span>
                </div>
                <div style={{ background: '#e0e0e0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min(100, Math.max(0, faction.favor + 50))}%`,
                    height: '100%',
                    background: getFavorColor(faction.favor),
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Laws */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#c9a227' }}>Leggi Reali</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {laws.map(law => (
            <div key={law.id} style={{
              background: law.active ? 'linear-gradient(135deg, #f1f8e9, #dcedc8)' : '#fff',
              border: `2px solid ${law.active ? '#4caf50' : '#263238'}`,
              padding: '20px',
              borderRadius: '10px',
              boxShadow: law.active ? '0 0 15px rgba(76,175,80,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
              opacity: law.active ? 1 : 1,
              transition: 'all 0.3s'
            }}>
              <h4 style={{ fontFamily: 'MedievalSharp', marginBottom: '10px' }}>{law.name}</h4>
              <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>{law.description}</p>
              <p style={{ fontSize: '0.85em', color: '#8b6914' }}>Costo: {law.cost} oro</p>
              {law.active ? (
                <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '0.9em' }}>✓ Attiva</span>
              ) : (
                <button
                  onClick={() => onEnactLaw(law.id)}
                  disabled={gold < law.cost}
                  style={{
                    marginTop: '10px',
                    padding: '8px 15px',
                    background: gold >= law.cost ? '#c9a227' : '#bdbdbd',
                    border: 'none',
                    borderRadius: '5px',
                    fontFamily: 'MedievalSharp',
                    fontWeight: 'bold',
                    cursor: gold >= law.cost ? 'pointer' : 'not-allowed',
                    transition: '0.2s'
                  }}
                >
                  Proclama
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Diplomacy */}
      <div>
        <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#c9a227' }}>Relazioni Diplomatiche</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {kingdoms.map(kingdom => (
            <div key={kingdom.name} style={{
              background: '#fff',
              border: '2px solid #263238',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ fontFamily: 'MedievalSharp', margin: 0 }}>{kingdom.name}</h4>
                {getStatusBadge(kingdom.status)}
              </div>
              <p style={{ fontSize: '0.85em', color: '#666' }}>Forza: {kingdom.strength}</p>
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Relazioni</span>
                  <span style={{ fontWeight: 'bold', color: getRelationsColor(kingdom.relations) }}>{kingdom.relations}%</span>
                </div>
                <div style={{ background: '#e0e0e0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(kingdom.relations + 100) / 2}%`,
                    height: '100%',
                    background: getRelationsColor(kingdom.relations),
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
              
              {kingdom.activeMission && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                  borderRadius: '8px',
                  border: '1px solid #2196f3'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2em' }}>{getMissionIcon(kingdom.activeMission.type)}</span>
                    <strong style={{ fontSize: '0.85em' }}>{kingdom.activeMission.description}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', color: '#666', marginBottom: '5px' }}>
                    <span>Progresso</span>
                    <span>{kingdom.activeMission.progress}/{kingdom.activeMission.duration}</span>
                  </div>
                  <div style={{ background: '#90caf9', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(kingdom.activeMission.progress / kingdom.activeMission.duration) * 100}%`,
                      height: '100%',
                      background: '#1976d2',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  onClick={() => onUpdateDiplomacy(kingdom.name, 10)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#4caf50',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'MedievalSharp',
                    cursor: 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  + Invia Dono
                </button>
                <button
                  onClick={() => onUpdateDiplomacy(kingdom.name, -10)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#f44336',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'MedievalSharp',
                    cursor: 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  - Provoca
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
