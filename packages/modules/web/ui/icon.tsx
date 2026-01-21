import React from 'react';

export function Icon({icon:IconComponent,...props}: {icon: React.ElementType} & React.SVGProps<SVGSVGElement>) {
    return <IconComponent {...props} />;
}

export const MemoIcon = React.memo(Icon);