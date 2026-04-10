import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onReset: () => void;
  onSave?: () => void;
}

export function SidebarNav({ activeTab, onTabChange, onReset, onSave }: SidebarNavProps) {
  const navItems: NavItem[] = [
    { id: 'map', label: 'Regno', icon: '/assets/icons/nav_map.png' },
    { id: 'research', label: 'Ricerca', icon: '/assets/icons/nav_research.png' },
    { id: 'economy', label: 'Bilancio', icon: '/assets/icons/nav_economy.png' },
    { id: 'court', label: 'Corte', icon: '/assets/icons/nav_court.png' }
  ];

  return (
    <div className="game-nav-side">
      {navItems.map(item => (
        <button
          key={item.id}
          className={activeTab === item.id ? 'active' : ''}
          onClick={() => onTabChange(item.id)}
        >
           <img src={item.icon} alt={item.label} style={{ width: 20, height: 20, marginRight: 8 }} /> {item.label}
        </button>
      ))}
      {onSave && (
        <button 
          className="save-btn" 
          onClick={onSave}
          style={{
            background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
            border: '2px solid #c9a227',
            fontFamily: 'MedievalSharp',
            fontWeight: 'bold'
          }}
        >
          💾 Salva
        </button>
      )}
      <button className="reset-btn" onClick={onReset}>
        Nuova Partita
      </button>
    </div>
  );
}
