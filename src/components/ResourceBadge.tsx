import React from 'react';

interface ResourceBadgeProps {
  icon: string;
  value: number;
  color?: string;
  resourceId?: string;
}

export function ResourceBadge({ icon, value, color, resourceId }: ResourceBadgeProps) {
  const iconPath = resourceId ? `/assets/icons/${resourceId}.png` : null;
  
  return (
    <div className="res-badge" style={color ? { color } : {}}>
      {iconPath ? (
        <img src={iconPath} alt={resourceId} style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 4 }} />
      ) : (
        <span style={{ marginRight: 4 }}>{icon}</span>
      )}
      {Math.floor(value)}
    </div>
  );
}
