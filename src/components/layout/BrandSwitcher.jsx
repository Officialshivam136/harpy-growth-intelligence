import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Building2, PlusCircle } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';
import { cn } from '../../utils/cn';

export function BrandSwitcher({ collapsed = false }) {
  const { brands, selectedBrand, setSelectedBrand } = useBrand();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-2 rounded-lg bg-harpy-navy/80 hover:bg-slate-800/60 border border-harpy-cardBorder transition-all duration-150 text-left',
          collapsed ? 'justify-center p-2' : 'px-3 py-2.5'
        )}
        title={selectedBrand?.name}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald/20 to-electric/20 border border-emerald/30 flex items-center justify-center shrink-0 text-white font-bold text-xs">
            {selectedBrand?.code?.slice(0, 3) || 'HPY'}
          </div>
          {!collapsed && (
            <div className="truncate text-left">
              <p className="text-xs font-semibold text-slate-100 truncate">
                {selectedBrand?.name}
              </p>
              <p className="text-[10px] text-harpy-subtle font-medium">
                {selectedBrand?.badge || 'Amazon Store'}
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 z-50 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder shadow-2xl py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-harpy-cardBorder/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Brand Portfolio
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {brands.map((brand) => {
              const isSelected = selectedBrand?.id === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left hover:bg-slate-800/60',
                    isSelected && 'bg-slate-800/80 text-white font-medium'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0',
                        isSelected
                          ? 'bg-emerald text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      )}
                    >
                      {brand.code}
                    </div>
                    <div className="truncate">
                      <p className="truncate text-slate-200">{brand.name}</p>
                      <p className="text-[10px] text-harpy-subtle">{brand.badge}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-harpy-cardBorder/60">
            <button
              onClick={() => {
                alert('Add Brand: Amazon SP-API OAuth connection modal will open.');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium text-electric hover:bg-electric/10 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Connect New Amazon Brand</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandSwitcher;

