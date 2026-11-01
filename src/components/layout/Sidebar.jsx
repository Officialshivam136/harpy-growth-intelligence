import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  BarChart3,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  AlertTriangle,
  FileText,
  Sparkles,
  Database,
} from 'lucide-react';
import { BrandSwitcher } from './BrandSwitcher';
import { useBrand } from '../../context/BrandContext';
import { cn } from '../../utils/cn';

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { isSyncing, lastSyncTime, triggerSpApiSync, alertStats } = useBrand();

  const navigationItems = [
    {
      name: 'Executive Overview',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Brand Portfolio',
      href: '/brands',
      icon: Layers,
      badge: '3 Brands',
    },
    {
      name: 'Sales & Revenue',
      href: '/analytics',
      icon: TrendingUp,
      badge: null,
    },
    {
      name: 'PPC & Advertising',
      href: '/advertising',
      icon: BarChart3,
      badge: 'TACoS 11%',
    },
    {
      name: 'Smart Alerts',
      href: '/alerts',
      icon: AlertTriangle,
      badge: alertStats?.globalActiveCount > 0 ? `${alertStats.globalActiveCount} Active` : null,
      badgeVariant: alertStats?.globalCriticalCount > 0 ? 'rose' : 'amber',
    },
    {
      name: 'Client Reports',
      href: '/reports',
      icon: FileText,
      badge: 'PDF',
      badgeVariant: 'electric',
    },
    {
      name: 'AI Analyst',
      href: '/analyst',
      icon: Sparkles,
      badge: 'AI',
      badgeVariant: 'electric',
    },
    {
      name: 'FBA Inventory',
      href: '/inventory',
      icon: Package,
      badge: null,
    },
    {
      name: 'CSV Data Ingestion',
      href: '/import',
      icon: Database,
      badge: 'CSV',
      badgeVariant: 'amber',
    },
    {
      name: 'Settings & SP-API',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-harpy-charcoal border-r border-harpy-cardBorder select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-harpy-cardBorder/70 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Emblem */}
          <div className="relative w-9 h-9 rounded-xl bg-harpy-navy border border-harpy-cardBorder flex items-center justify-center shrink-0 shadow-emerald-glow">
            <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
              <path
                d="M10 26L18 10L23 20L30 14L24 30L16 24L10 26Z"
                fill="url(#sidebar-harpy-grad)"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="20" r="2.5" fill="#22C55E" />
              <defs>
                <linearGradient id="sidebar-harpy-grad" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8" />
                  <stop offset="0.6" stopColor="#0284C7" />
                  <stop offset="1" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">HARPY</span>
                <span className="text-[10px] font-semibold tracking-wider text-electric bg-electric/10 px-1 py-0.2 rounded border border-electric/20">
                  GROWTH
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                Amazon Intelligence
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Brand Selector Widget */}
      <div className="p-3 border-b border-harpy-cardBorder/50">
        <BrandSwitcher collapsed={collapsed} />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-2">
          {!collapsed ? (
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Analytics & Core
            </span>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group relative',
                  isActive
                    ? 'bg-slate-800/90 text-white font-semibold shadow-inner border border-harpy-cardBorder/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40',
                  collapsed && 'justify-center px-2 py-2.5'
                )
              }
              title={collapsed ? `${item.name}${item.badge ? ` (${item.badge})` : ''}` : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald rounded-r-full shadow-emerald-glow" />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-electric' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0',
                        item.badgeVariant === 'rose'
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                          : item.badgeVariant === 'amber'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                          : item.badgeVariant === 'electric'
                          ? 'bg-sky-950/80 text-sky-400 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700/50'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span
                      className={cn(
                        'absolute top-1.5 right-1.5 w-2 h-2 rounded-full',
                        item.badgeVariant === 'rose'
                          ? 'bg-rose-500 ring-2 ring-harpy-charcoal animate-pulse'
                          : item.badgeVariant === 'amber'
                          ? 'bg-amber-400 ring-2 ring-harpy-charcoal'
                          : 'bg-electric'
                      )}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* SP-API Sync Status Footer */}
      <div className="p-3 border-t border-harpy-cardBorder/60 bg-harpy-navy/40">
        {!collapsed ? (
          <div className="rounded-xl bg-harpy-navy/80 border border-harpy-cardBorder p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
                </span>
                <span className="text-[11px] font-semibold text-slate-200">
                  Amazon SP-API
                </span>
              </div>
              <button
                onClick={triggerSpApiSync}
                disabled={isSyncing}
                title="Sync SP-API data now"
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', isSyncing && 'animate-spin text-electric')} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-harpy-subtle">
              <span>Status: Synchronized</span>
              <span>{lastSyncTime}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <button
              onClick={triggerSpApiSync}
              disabled={isSyncing}
              title={`Amazon SP-API Connected • ${lastSyncTime}`}
              className="p-2 rounded-lg bg-harpy-navy border border-harpy-cardBorder text-emerald hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={cn('w-4 h-4', isSyncing && 'animate-spin text-electric')} />
            </button>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-end pt-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800/60 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 transition-all duration-300 z-30',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="fixed inset-y-0 left-0 z-30 transition-all duration-300 flex flex-col h-screen" style={{ width: collapsed ? '5rem' : '16rem' }}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-xs flex flex-col h-full z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
