import React from 'react';

interface ResourceBadgeProps {
  icon: string;
  value: number;
  color?: string;
}

export function ResourceBadge({ icon, value, color }: ResourceBadgeProps) {
  return (
    <div className="res-badge" style={color ? { color } : {}}>
      {icon} {Math.floor(value)}
    </div>
  );
}
