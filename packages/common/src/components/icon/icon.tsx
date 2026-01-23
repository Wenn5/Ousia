import React from 'react';

type LucideIconProps = {
    icon: React.ElementType,
    size?: number,
    color?: string,
    strokeWidth?: number,
    absoluteStrokeWidth?: boolean,
};

/**
 * 
 * @param param0 
 * @returns 
 */
export function Icon({icon:IconComponent, size, color, strokeWidth, absoluteStrokeWidth, ...props}: LucideIconProps & React.SVGProps<SVGSVGElement>) {
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} absoluteStrokeWidth={absoluteStrokeWidth} {...props} />;
}

export const MemoIcon = React.memo(Icon);