import React from 'react';
import type { Resources } from '../game/types';

interface AdvancedEconomyPanelProps {
  resources: Resources;
  inflation: number;
  population: { peasants: number; citizens: number; nobles: number; total: number; happiness: number; health: number };
  season: string;
  taxRate: number;
  debt: number;
  defenseRating: number;
  onSetTaxRate: (rate: number) => void;
  onTakeLoan: (amount: number) => void;
  onRepayDebt: (amount: number) => void;
}

export function AdvancedEconomyPanel({
  resources,
  inflation,
  population,
  season,
  taxRate,
  debt,
  defenseRating,
  onSetTaxRate,
  onTakeLoan,
  onRepayDebt
}: AdvancedEconomyPanelProps) {
  const seasons = {
    spring: { name: 'Primavera', icon: '🌸', effect: '+20% grano' },
    summer: { name: 'Estate', icon: '☀️', effect: '+10 cibo' },
    autumn: { name: 'Autunno', icon: '🍂', effect: '+50% grano' },
    winter: { name: 'Inverno', icon: '❄️', effect: '-30% cibo' }
  };

  const taxImpact = {
    veryLow: { rate: 0.05, happiness: 15, gold: 0.5 },
    low: { rate: 0.10, happiness: 10, gold: 1.0 },
    normal: { rate: 0.15, happiness: 0, gold: 1.5 },
    high: { rate: 0.25, happiness: -10, gold: 2.0 },
    veryHigh: { rate: 0.35, happiness: -25, gold: 2.5 },
    extreme: { rate: 0.50, happiness: -50, gold: 3.0 }
  };

  const getCurrentTaxTier = () => {
    if (taxRate <= 0.05) return 'veryLow';
    if (taxRate <= 0.10) return 'low';
    if (taxRate <= 0.15) return 'normal';
    if (taxRate <= 0.25) return 'high';
    if (taxRate <= 0.35) return 'veryHigh';
    return 'extreme';
  };

  const currentTier = getCurrentTaxTier();
  const currentImpact = taxImpact[currentTier as keyof typeof taxImpact];

  const formatNumber = (num: number) => Math.floor(num * 10) / 10;

  return (
    <div className="panel-view" style={{ padding: '20px' }}>
      <h2 className="panel-title" style={{ marginBottom: '25px' }}>💰 Economia del Regno</h2>

      {/* Stagione e Inflazione */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #2196f3'
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{seasons[season as keyof typeof seasons]?.icon}</div>
          <div style={{ fontFamily: 'MedievalSharp', fontSize: '1.2em', color: '#1565c0' }}>
            {seasons[season as keyof typeof seasons]?.name}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            Effetto: {seasons[season as keyof typeof seasons]?.effect}
          </div>
        </div>

        <div style={{
          background: inflation > 1.2 ? 'linear-gradient(135deg, #ffebee, #ffcdd2)' : 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          padding: '20px',
          borderRadius: '12px',
          border: `2px solid ${inflation > 1.2 ? '#f44336' : '#4caf50'}`
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{inflation > 1.2 ? '📈' : '💹'}</div>
          <div style={{ fontFamily: 'MedievalSharp', fontSize: '1.2em', color: '#333' }}>
            Inflazione: {(inflation * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            {inflation > 1.2 ? 'I prezzi stanno salendo!' : 'Economia stabile'}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #ff9800'
        }}>
          <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🛡️</div>
          <div style={{ fontFamily: 'MedievalSharp', fontSize: '1.2em', color: '#e65100' }}>
            Difesa: {defenseRating}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            {defenseRating > 80 ? 'Eccellente' : defenseRating > 50 ? 'Buona' : 'Debole'}
          </div>
        </div>
      </div>

      {/* Tassazione */}
      <div style={{
        background: '#fff',
        border: '2px solid #c9a227',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#c9a227', fontSize: '1.4em' }}>
          ⚖️ Tassazione del Regno
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Tassazione attuale: {(taxRate * 100).toFixed(0)}%</span>
            <span style={{ 
              color: currentImpact.happiness > 0 ? '#4caf50' : currentImpact.happiness < 0 ? '#f44336' : '#ff9800',
              fontWeight: 'bold'
            }}>
              {currentImpact.happiness > 0 ? '+' : ''}{currentImpact.happiness} felicità
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={taxRate * 100}
            onChange={(e) => onSetTaxRate(Number(e.target.value) / 100)}
            style={{ width: '100%', height: '10px', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.85em', color: '#666' }}>
            <span>0%</span>
            <span>10%</span>
            <span>20%</span>
            <span>30%</span>
            <span>40%</span>
            <span>50%</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          {Object.entries(taxImpact).map(([tier, impact]) => (
            <div
              key={tier}
              onClick={() => onSetTaxRate(impact.rate)}
              style={{
                padding: '12px',
                background: taxRate === impact.rate ? 'linear-gradient(135deg, #c9a227, #ffd54f)' : '#f5f5f5',
                border: `2px solid ${taxRate === impact.rate ? '#c9a227' : '#ddd'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                transform: taxRate === impact.rate ? 'scale(1.05)' : 'scale(1)',
                boxShadow: taxRate === impact.rate ? '0 4px 12px rgba(201,162,39,0.4)' : 'none'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '0.9em', textTransform: 'capitalize' }}>{tier}</div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>{(impact.rate * 100).toFixed(0)}%</div>
              <div style={{ fontSize: '0.75em', color: impact.happiness > 0 ? '#4caf50' : impact.happiness < 0 ? '#f44336' : '#666' }}>
                {impact.happiness > 0 ? '+' : ''}{impact.happiness} 😊
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: '#fff8e1', borderRadius: '8px', border: '1px solid #ffe082' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>📊 Moltiplicatore oro: x{formatNumber(currentImpact.gold)}</span>
            <span style={{ fontSize: '0.9em', color: '#666' }}>
              Produzione oro attuale: {formatNumber(resources.gold * currentImpact.gold)}/tick
            </span>
          </div>
        </div>
      </div>

      {/* Debiti e Prestiti */}
      <div style={{
        background: '#fff',
        border: '2px solid #2196f3',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#1976d2', fontSize: '1.4em' }}>
          🏦 Banca Reale
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>Debito attuale</div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: debt > 0 ? '#f44336' : '#4caf50' }}>
              💰 {Math.floor(debt)} oro
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>Interessi</div>
            <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#ff9800' }}>
              10% sul prestito
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Prendi prestito */}
          <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '10px', border: '2px solid #90caf9' }}>
            <h4 style={{ fontFamily: 'MedievalSharp', marginBottom: '15px', color: '#1565c0' }}>💵 Richiedi Prestito</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[50, 100, 250, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => onTakeLoan(amount)}
                  style={{
                    padding: '10px',
                    background: '#fff',
                    border: '2px solid #2196f3',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'MedievalSharp',
                    fontWeight: 'bold',
                    color: '#1565c0',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#2196f3';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#1565c0';
                  }}
                >
                  +{amount} oro (restituisci {Math.floor(amount * 1.1)})
                </button>
              ))}
            </div>
          </div>

          {/* Ripaga debito */}
          <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '10px', border: '2px solid #81c784' }}>
            <h4 style={{ fontFamily: 'MedievalSharp', marginBottom: '15px', color: '#2e7d32' }}>💸 Ripaga Debito</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[50, 100, 250, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => onRepayDebt(amount)}
                  disabled={debt === 0 || resources.gold < amount}
                  style={{
                    padding: '10px',
                    background: debt === 0 || resources.gold < amount ? '#f5f5f5' : '#fff',
                    border: `2px solid ${debt === 0 || resources.gold < amount ? '#bdbdbd' : '#4caf50'}`,
                    borderRadius: '6px',
                    cursor: debt === 0 || resources.gold < amount ? 'not-allowed' : 'pointer',
                    fontFamily: 'MedievalSharp',
                    fontWeight: 'bold',
                    color: debt === 0 || resources.gold < amount ? '#999' : '#2e7d32',
                    opacity: debt === 0 || resources.gold < amount ? 0.6 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  -{amount} oro {debt === 0 ? '(debito estinto)' : resources.gold < amount ? '(oro insuff.)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Riepilogo Risorse */}
      <div style={{
        background: '#fff',
        border: '2px solid #4caf50',
        borderRadius: '12px',
        padding: '25px'
      }}>
        <h3 style={{ fontFamily: 'MedievalSharp', marginBottom: '20px', color: '#2e7d32', fontSize: '1.4em' }}>
          📦 Risorse del Regno
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '15px' }}>
          {Object.entries(resources).filter(([_, value]) => value > 0).slice(0, 12).map(([resource, amount]) => (
            <div
              key={resource}
              style={{
                padding: '12px',
                background: '#f1f8e9',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #c5e1a5'
              }}
            >
              <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>
                {resource === 'gold' ? '💰' : resource === 'food' ? '🍞' : resource === 'wood' ? '🪵' : resource === 'stone' ? '🪨' : resource === 'iron' ? '⛓️' : resource === 'knowledge' ? '📚' : resource === 'prestige' ? '👑' : resource === 'piety' ? '⛪' : '📦'}
              </div>
              <div style={{ fontSize: '0.75em', color: '#666', textTransform: 'capitalize' }}>{resource}</div>
              <div style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '1.1em' }}>{Math.floor(amount)}</div>
            </div>
          ))}
        </div>

        {Object.keys(resources).filter(k => resources[k as keyof Resources] > 0).length > 12 && (
          <div style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '0.9em' }}>
            +{Object.keys(resources).filter(k => resources[k as keyof Resources] > 0).length - 12} altre risorse
          </div>
        )}
      </div>
    </div>
  );
}
