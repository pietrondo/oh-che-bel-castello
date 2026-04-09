import React, { useState } from 'react';

export interface GameSetupData {
  sovereignName: string;
  dynastyName: string;
  region: string;
  difficulty: 'easy' | 'normal' | 'hard';
}

interface GameSetupProps {
  onStartGame: (setup: GameSetupData) => void;
  onLoadGame: () => void;
  hasSavedGames: boolean;
}

const REGIONS = [
  { id: 'north', name: 'Regno del Nord', description: 'Terre fredde ma ricche di minerali', bonus: '+20% produzione pietra, +15% ferro', icon: '🏔️' },
  { id: 'south', name: 'Regno del Sud', description: 'Terre fertili e soleggiate', bonus: '+20% produzione grano, +15% vino', icon: '🌾' },
  { id: 'east', name: 'Regno dell\'Est', description: 'Foreste incontaminate', bonus: '+20% produzione legno, +15% conoscenza', icon: '🌲' },
  { id: 'west', name: 'Regno dell\'Ovest', description: 'Coste commerciali prospere', bonus: '+20% produzione oro, +15% commercio', icon: '🌊' },
  { id: 'central', name: 'Regno Centrale', description: 'Cuore del continente', bonus: '+10% tutte le risorse, +5 felicità', icon: '👑' },
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Conte', description: 'Risorse iniziali +50%, eventi negativi -30%', icon: '🏰' },
  { id: 'normal', name: 'Duca', description: 'Esperienza bilanciata', icon: '🏵️' },
  { id: 'hard', name: 'Re', description: 'Risorse iniziali -25%, eventi negativi +20%', icon: '👑' },
];

const NAMES = [
  'Aldobrando', 'Berengario', 'Carlo', 'Domenico', 'Edoardo', 'Federico', 'Guglielmo', 'Henrico',
  'Igor', 'Jacopo', 'Kurt', 'Luigi', 'Marco', 'Nicola', 'Ottone', 'Pietro',
  'Quirino', 'Roberto', 'Stefano', 'Tommaso', 'Uberto', 'Vincenzo', 'Walter', 'Xavier'
];

const DYNASTIES = [
  'degli Asburgo', 'dei Borbone', 'Capetingi', 'degli Estensi', 'Farnese', 'Gonzaga',
  'degli Hohenstaufen', 'degli Lancaster', 'Medici', 'Normanni', 'Orsini', 'Plantageneti',
  'dei Savoia', 'Sforza', 'Valois', 'Wittelsbach'
];

export function GameSetup({ onStartGame, onLoadGame, hasSavedGames }: GameSetupProps) {
  const [sovereignName, setSovereignName] = useState('');
  const [dynastyName, setDynastyName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('central');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showDynastySuggestions, setShowDynastySuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sovereignName.trim() || !dynastyName.trim()) return;
    
    onStartGame({
      sovereignName: sovereignName.trim(),
      dynastyName: dynastyName.trim(),
      region: selectedRegion,
      difficulty
    });
  };

  const selectedRegionData = REGIONS.find(r => r.id === selectedRegion);
  const selectedDifficultyData = DIFFICULTIES.find(d => d.id === difficulty);

  return (
    <div className="game-setup">
      <div className="setup-container">
        <h1 className="setup-title">🏰 Oh Che Bel Castello!</h1>
        <p className="setup-subtitle">Gestisci il tuo regno medievale</p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-section">
            <h2>👑 Il Tuo Sovrano</h2>
            
            <div className="form-group">
              <label htmlFor="sovereign-name">Nome del Sovrano</label>
              <div className="input-with-suggestions">
                <input
                  id="sovereign-name"
                  type="text"
                  value={sovereignName}
                  onChange={(e) => setSovereignName(e.target.value)}
                  onFocus={() => setShowNameSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowNameSuggestions(false), 200)}
                  placeholder="Inserisci il tuo nome..."
                  required
                  maxLength={20}
                />
                {showNameSuggestions && (
                  <div className="suggestions-dropdown">
                    {NAMES.map(name => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          setSovereignName(name);
                          setShowNameSuggestions(false);
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dynasty-name">Dinastia</label>
              <div className="input-with-suggestions">
                <input
                  id="dynasty-name"
                  type="text"
                  value={dynastyName}
                  onChange={(e) => setDynastyName(e.target.value)}
                  onFocus={() => setShowDynastySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDynastySuggestions(false), 200)}
                  placeholder="Nome della tua dinastia..."
                  required
                  maxLength={25}
                />
                {showDynastySuggestions && (
                  <div className="suggestions-dropdown">
                    {DYNASTIES.map(dynasty => (
                      <button
                        key={dynasty}
                        type="button"
                        onClick={() => {
                          setDynastyName(dynasty);
                          setShowDynastySuggestions(false);
                        }}
                      >
                        {dynasty}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>🗺️ Scegli la Tua Regione</h2>
            <div className="region-grid">
              {REGIONS.map(region => (
                <button
                  key={region.id}
                  type="button"
                  className={`region-card ${selectedRegion === region.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRegion(region.id)}
                >
                  <span className="region-icon">{region.icon}</span>
                  <span className="region-name">{region.name}</span>
                  <span className="region-desc">{region.description}</span>
                  <span className="region-bonus">{region.bonus}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>⚔️ Difficoltà</h2>
            <div className="difficulty-grid">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff.id}
                  type="button"
                  className={`difficulty-card ${difficulty === diff.id ? 'selected' : ''}`}
                  onClick={() => setDifficulty(diff.id)}
                >
                  <span className="difficulty-icon">{diff.icon}</span>
                  <span className="difficulty-name">{diff.name}</span>
                  <span className="difficulty-desc">{diff.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="setup-summary">
            <h3>📜 Riepilogo</h3>
            <p>
              <strong>{sovereignName || '???'}</strong> della dinastia <strong>{dynastyName || '???'}</strong>
            </p>
            <p>Regnerà su: <strong>{selectedRegionData?.name}</strong></p>
            <p>Difficoltà: <strong>{selectedDifficultyData?.name}</strong></p>
            {selectedRegionData && (
              <p className="summary-bonus">🎁 Bonus: {selectedRegionData.bonus}</p>
            )}
          </div>

          <div className="setup-actions">
            <button type="submit" className="btn-start" disabled={!sovereignName.trim() || !dynastyName.trim()}>
              🚀 Inizia Nuova Partita
            </button>
            {hasSavedGames && (
              <button type="button" className="btn-load" onClick={onLoadGame}>
                📂 Carica Partita Salvata
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
