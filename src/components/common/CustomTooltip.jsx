import React from 'react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export function CustomTooltip({ active, payload, label, currency = 'USD' }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg bg-harpy-charcoal/95 border border-harpy-cardBorder px-4 py-3 shadow-xl backdrop-blur-md min-w-[180px]">
      <p className="text-xs font-semibold text-slate-300 pb-2 mb-2 border-b border-harpy-cardBorder">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((item, index) => {
          let formattedValue = item.value;
          if (item.name.toLowerCase().includes('tacos') || item.name.toLowerCase().includes('rate')) {
            formattedValue = formatPercentage(item.value, false);
          } else if (item.name.toLowerCase().includes('sales') || item.name.toLowerCase().includes('spend') || item.name.toLowerCase().includes('revenue')) {
            formattedValue = formatCurrency(item.value, currency);
          } else {
            formattedValue = item.value?.toLocaleString() ?? item.value;
          }

          return (
            <div key={`item-${index}`} className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: item.color || item.fill || '#38BDF8' }}
                />
                <span className="text-slate-400 font-medium">{item.name}:</span>
              </div>
              <span className="font-semibold text-slate-100">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomTooltip;

