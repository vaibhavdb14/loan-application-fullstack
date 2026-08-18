import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-4">
    {Icon && (
      <div className="w-14 h-14 bg-banking-softBlue text-banking-primary rounded-full flex items-center justify-center mb-4">
        <Icon size={26} />
      </div>
    )}
    <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
    {description && <p className="text-sm text-text-muted max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
