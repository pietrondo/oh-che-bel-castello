import React from 'react';
import type { Sovereign, Law, Faction, Kingdom, DiplomaticMission, Heir, SuccessionLaw } from '../game/types';

interface CourtPanelProps {
  sovereign: Sovereign;
  heir: Sovereign;
  heirs: Heir[];
  successionLaw: SuccessionLaw;
  laws: Law[];
  factions: Faction[];
  kingdoms: Kingdom[];
  gold: number;
  onEnactLaw: (id: string) => void;
  onUpdateDiplomacy: (kingdom: string, delta: number) => void;
  onStartDiplomaticMission?: (kingdom: string, missionType: string) => void;
}

export function CourtPanel({ 
  sovereign, 
  heir, 
  heirs,
  successionLaw,
  laws, 
  factions, 
  kingdoms,
  gold,
  onEnactLaw,
  onUpdateDiplomacy,
  onStartDiplomaticMission
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
    const icons: Record<string, string> = { 
      trade: '🐫', 
      military: '⚔️', 
      cultural: '🎭', 
      aid: '🤝',
      marriage: '💍',
      embassy: '🏛️',
      tribute: '💰',
      espionage: '🗡️'
    };
    return icons[type] || '📜';
  };

  const getMissionCost = (type: string) => {
    const costs: Record<string, string> = {
      trade: '50 oro',
      military: '100 oro, 20 attrezzi',
      cultural: '40 conoscenza',
      aid: '100 cibo, 50 pane',
      marriage: '300 oro, 50 prestigio',
      embassy: '200 oro, 100 pietra',
      tribute: '150 oro, 5 gioielli',
      espionage: '80 oro'
    };
    return costs[type] || '';
  };

  const getMissionDesc = (type: string) => {
    const descs: Record<string, string> = {
      trade: 'Rotte Commerciali',
      military: 'Supporto Militare',
      cultural: 'Scambio Culturale',
      aid: 'Aiuti Umanitari',
      marriage: 'Matrimonio Reale',
      embassy: 'Ambasciata',
      tribute: 'Tributi',
      espionage: 'Spionaggio'
    };
    return descs[type] || 'Missione';
  };

  const [expandedKingdom, setExpandedKingdom] = React.useState<string | null>(null);

  const availableMissions: Array<{ type: string; icon: string; name: string; cost: string }> = [
    { type: 'trade', icon: '🐫', name: 'Commercio', cost: '50 oro' },
    { type: 'military', icon: '⚔️', name: 'Militare', cost: '100 oro, 20 attrezzi' },
    { type: 'cultural', icon: '🎭', name: 'Cultura', cost: '40 conoscenza' },
    { type: 'aid', icon: '🤝', name: 'Aiuti', cost: '100 cibo, 50 pane' },
    { type: 'marriage', icon: '💍', name: 'Matrimonio', cost: '300 oro, 50 prestigio' },
    { type: 'embassy', icon: '🏛️', name: 'Ambasciata', cost: '200 oro, 100 pietra' },
    { type: 'tribute', icon: '💰', name: 'Tributi', cost: '150 oro, 5 gioielli' },
    { type: 'espionage', icon: '🗡️', name: 'Spionaggio', cost: '80 oro' }
  ];

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

      {/* Succession Law & Heirs */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#c9a227' }}>👑 Successione Dinastica</h3>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #fff8e1, #ffecb3)',
          border: '2px solid #c9a227',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1em' }}>Legge di Successione:</strong>
              <span style={{ 
                marginLeft: '10px', 
                padding: '4px 12px', 
                background: '#c9a227', 
                color: '#fff',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '0.9em'
              }}>
                {successionLaw === 'primogeniture' ? 'Primogenitura' : 
                 successionLaw === 'ultimogeniture' ? 'Ultimogenitura' :
                 successionLaw === 'elective' ? 'Elettiva' : 'Gavelkind'}
              </span>
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              {successionLaw === 'primogeniture' && 'Il figlio maggiore ereda il trono'}
              {successionLaw === 'ultimogeniture' && 'Il figlio minore ereda il trono'}
              {successionLaw === 'elective' && 'I nobili eleggono il successore'}
              {successionLaw === 'gavelkind' && 'Il regno viene diviso tra gli eredi'}
            </div>
          </div>
        </div>

        <h4 style={{ fontFamily: 'MedievalSharp', marginBottom: '15px', color: '#c9a227' }}>Linea di Successione</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
          {heirs.filter(h => h.alive).sort((a, b) => a.successionOrder - b.successionOrder).map((heir, idx) => (
            <div key={heir.id} style={{
              background: idx === 0 ? 'linear-gradient(135deg, #fff8e1, #ffecb3)' : '#fff',
              border: `2px solid ${idx === 0 ? '#c9a227' : '#ddd'}`,
              padding: '15px',
              borderRadius: '10px',
              boxShadow: idx === 0 ? '0 4px 12px rgba(201,162,39,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-10px', 
                left: '10px', 
                background: idx === 0 ? '#c9a227' : '#999',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '10px',
                fontSize: '0.75em',
                fontWeight: 'bold'
              }}>
                #{idx + 1} in linea
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                <div style={{ fontSize: '2.5em' }}>
                  {heir.relation === 'son' || heir.relation === 'daughter' ? '👶' : 
                   heir.relation === 'brother' || heir.relation === 'sister' ? '🧑' : '🧒'}
                </div>
                <div>
                  <h4 style={{ fontFamily: 'MedievalSharp', margin: '0 0 5px 0', fontSize: '1.1em' }}>{heir.name}</h4>
                  <p style={{ fontSize: '0.85em', color: '#666', margin: '2px 0' }}>
                    {heir.relation === 'son' ? 'Figlio' : 
                     heir.relation === 'daughter' ? 'Figlia' :
                     heir.relation === 'brother' ? 'Fratello' :
                     heir.relation === 'sister' ? 'Sorella' :
                     heir.relation === 'cousin' ? 'Cugino/a' :
                     heir.relation === 'nephew' ? 'Nipote' : 'Nipote'} del sovrano
                  </p>
                  <p style={{ fontSize: '0.85em', color: '#666', margin: '2px 0' }}>
                    Età: {Math.floor(heir.age)} anni
                  </p>
                  <p style={{ fontSize: '0.85em', color: '#666', margin: '2px 0' }}>
                    Forza pretesa: 
                    <span style={{ 
                      color: heir.claimStrength >= 80 ? '#4caf50' : heir.claimStrength >= 50 ? '#ff9800' : '#f44336',
                      fontWeight: 'bold'
                    }}> {heir.claimStrength}%</span>
                  </p>
                  {heir.traits.length > 0 && (
                    <div style={{ marginTop: '5px' }}>
                      {heir.traits.map((trait, i) => (
                        <span key={i} style={{ 
                          fontSize: '0.75em', 
                          background: '#e0e0e0', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          marginRight: '5px'
                        }}>
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {heir.isFavorite && (
                <div 
                  title="Preferito dal sovrano"
                  style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    fontSize: '1.2em'
                  }}>
                  ⭐
                </div>
              )}
            </div>
          ))}
          {heirs.filter(h => h.alive).length === 0 && (
            <div style={{ 
              padding: '30px', 
              textAlign: 'center', 
              background: '#ffebee', 
              borderRadius: '10px',
              border: '2px solid #f44336'
            }}>
              <p style={{ color: '#c62828', fontWeight: 'bold', fontSize: '1.1em' }}>⚠️ Nessun erede disponibile!</p>
              <p style={{ color: '#666', fontSize: '0.9em' }}>Rischio di crisi di successione elevato</p>
            </div>
          )}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
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
              <p style={{ fontSize: '0.85em', color: '#666' }}>Forza: {kingdom.strength} | Missioni completate: {kingdom.missionsCompleted || 0}</p>
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
                  <div style={{ fontSize: '0.7em', color: '#666', marginTop: '5px', textAlign: 'center' }}>
                    Chance successo: {Math.round(kingdom.activeMission.successChance)}%
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  onClick={() => onUpdateDiplomacy(kingdom.name, 10)}
                  disabled={kingdom.status === 'war'}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: kingdom.status === 'war' ? '#bdbdbd' : '#4caf50',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'MedievalSharp',
                    cursor: kingdom.status === 'war' ? 'not-allowed' : 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  + Dono
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
                {onStartDiplomaticMission && kingdom.status !== 'war' && !kingdom.activeMission && (
                  <button
                    onClick={() => setExpandedKingdom(expandedKingdom === kingdom.name ? null : kingdom.name)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#2196f3',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      fontFamily: 'MedievalSharp',
                      cursor: 'pointer',
                      fontSize: '0.85em'
                    }}
                  >
                    📜 Missioni
                  </button>
                )}
              </div>
              
              {expandedKingdom === kingdom.name && onStartDiplomaticMission && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  <h5 style={{ fontFamily: 'MedievalSharp', marginBottom: '10px', fontSize: '0.95em' }}>Seleziona Missione</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {availableMissions.map(mission => (
                      <button
                        key={mission.type}
                        onClick={() => {
                          onStartDiplomaticMission(kingdom.name, mission.type);
                          setExpandedKingdom(null);
                        }}
                        style={{
                          padding: '8px',
                          background: '#fff',
                          border: '2px solid #2196f3',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: '1.2em', marginBottom: '4px' }}>{mission.icon}</div>
                        <div style={{ fontSize: '0.8em', fontWeight: 'bold', color: '#333' }}>{mission.name}</div>
                        <div style={{ fontSize: '0.65em', color: '#666' }}>{mission.cost}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
