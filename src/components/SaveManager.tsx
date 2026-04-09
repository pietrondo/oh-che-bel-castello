import React, { useState, useEffect } from 'react';
import type { SaveSlot } from '../game/useGameEngine';

interface SaveManagerProps {
  onSave: (slotId: number, name: string) => void;
  onLoad: (slotId: number) => void;
  onDelete: (slotId: number) => void;
  getSaveSlots: () => SaveSlot[];
  onClose: () => void;
}

export function SaveManager({ onSave, onLoad, onDelete, getSaveSlots, onClose }: SaveManagerProps) {
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [slotName, setSlotName] = useState('');

  useEffect(() => {
    setSlots(getSaveSlots());
  }, [getSaveSlots]);

  const handleSave = () => {
    if (editingSlot !== null && slotName.trim()) {
      onSave(editingSlot, slotName.trim());
      setSlots(getSaveSlots());
      setEditingSlot(null);
      setSlotName('');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      zIndex: 10000
    }}>
      <div style={{
        background: '#1a1a2e',
        border: '3px solid #c9a227',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ 
          fontFamily: 'MedievalSharp', 
          color: '#c9a227', 
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '1.8em'
        }}>
          💾 Gestisci Salvataggi
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'MedievalSharp', color: '#fff', marginBottom: '10px' }}>Salva Partita</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[0, 1, 2].map(slotId => {
              const slot = slots.find(s => s.id === slotId);
              return (
                <button
                  key={slotId}
                  onClick={() => {
                    setEditingSlot(slotId);
                    setSlotName(slot?.name || `Partita ${slotId + 1}`);
                  }}
                  style={{
                    flex: 1,
                    minWidth: '150px',
                    padding: '15px',
                    background: slot ? 'linear-gradient(135deg, #2e7d32, #1b5e20)' : 'linear-gradient(135deg, #1976d2, #0d47a1)',
                    border: '2px solid #c9a227',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'MedievalSharp',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                >
                  <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>💾</div>
                  <div style={{ fontWeight: 'bold' }}>Slot {slotId + 1}</div>
                  {slot && (
                    <div style={{ fontSize: '0.75em', opacity: 0.8, marginTop: '5px' }}>
                      {slot.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {editingSlot !== null && (
          <div style={{
            background: '#2a2a3e',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c9a227'
          }}>
            <h4 style={{ fontFamily: 'MedievalSharp', color: '#fff', marginBottom: '10px' }}>
              Salva in Slot {editingSlot + 1}
            </h4>
            <input
              type="text"
              value={slotName}
              onChange={(e) => setSlotName(e.target.value)}
              placeholder="Nome salvataggio..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #c9a227',
                background: '#1a1a2e',
                color: '#fff',
                fontFamily: 'MedievalSharp',
                marginBottom: '10px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#4caf50',
                  border: 'none',
                  borderRadius: '5px',
                  color: '#fff',
                  fontFamily: 'MedievalSharp',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Salva
              </button>
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setSlotName('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#757575',
                  border: 'none',
                  borderRadius: '5px',
                  color: '#fff',
                  fontFamily: 'MedievalSharp',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Annulla
              </button>
            </div>
          </div>
        )}

        {slots.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'MedievalSharp', color: '#fff', marginBottom: '15px' }}>Salvataggi Esistenti</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {slots.map(slot => (
                <div
                  key={slot.id}
                  style={{
                    background: '#2a2a3e',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'MedievalSharp', color: '#c9a227', fontWeight: 'bold', fontSize: '1.1em' }}>
                      {slot.name}
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#888', marginTop: '5px' }}>
                      📅 {formatDate(slot.date)} | Anno: {slot.gameState.time.year} | Pop: {Math.floor(slot.gameState.population.total)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => onLoad(slot.id)}
                      style={{
                        padding: '8px 15px',
                        background: '#2196f3',
                        border: 'none',
                        borderRadius: '5px',
                        color: '#fff',
                        fontFamily: 'MedievalSharp',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Carica
                    </button>
                    <button
                      onClick={() => onDelete(slot.id)}
                      style={{
                        padding: '8px 15px',
                        background: '#f44336',
                        border: 'none',
                        borderRadius: '5px',
                        color: '#fff',
                        fontFamily: 'MedievalSharp',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '20px',
            background: 'linear-gradient(135deg, #c9a227, #8b6914)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'MedievalSharp',
            fontWeight: 'bold',
            fontSize: '1em',
            cursor: 'pointer'
          }}
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}
