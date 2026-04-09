import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface ParticleSystemProps {
  active: boolean;
  type: 'build' | 'harvest' | 'celebrate' | 'sparkle';
  x: number;
  y: number;
}

export function ParticleSystem({ active, type, x, y }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const particleCount = type === 'celebrate' ? 50 : type === 'build' ? 20 : 15;
    const colors = {
      build: ['#ffb300', '#ffca28', '#fff9c4'],
      harvest: ['#43a047', '#66bb6a', '#a5d6a7'],
      celebrate: ['#ffb300', '#ff7043', '#42a5f5', '#ab47bc'],
      sparkle: ['#ffffff', '#e3f2fd', '#fff9c4']
    };

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        size: 3 + Math.random() * 4
      });
    }
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [active, type]);

  if (particles.length === 0) return null;

  return (
    <div className="particle-system" style={{ left: x, top: y }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            transform: `translate(${p.x}px, ${p.y}px)`,
            opacity: p.life,
            backgroundColor: p.color,
            width: p.size,
            height: p.size
          }}
        />
      ))}
    </div>
  );
}
