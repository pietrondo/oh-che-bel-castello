import React from 'react';

interface CourtPanelProps {
  sovereign: {
    name: string;
    age: number;
    portrait: string;
  };
}

export function CourtPanel({ sovereign }: CourtPanelProps) {
  return (
    <div className="panel-view">
      <h2 className="panel-title">La Corte Reale</h2>
      <div className="sovereign-card">
        <div className="portrait-large">{sovereign.portrait}</div>
        <div className="sovereign-details">
          <h3>{sovereign.name}</h3>
          <p>Età: {sovereign.age} anni</p>
          <p>Status: In vita</p>
        </div>
      </div>
    </div>
  );
}
