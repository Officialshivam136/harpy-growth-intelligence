import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Building2,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useBrand } from '../../context/BrandContext';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';

export function Header({ setMobileOpen }) {
  const navigate = useNavigate();
  const {
    brands,
    selectedBrand,
    setSelectedBrand,
    dateRanges,
    selectedDateRange,
    setSelectedDateRange,
    notifications,
    markAllNotificationsRead,
  } = useBrand();

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const brandRef = useRef(null);
  const dateRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setBrandDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDateDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const activeDateConfig = dateRanges.find((d) => d.id === selectedDateRange) || dateRanges[1];

  return (
    <header className="sticky top-0 z-20 h-16 bg-harpy-charcoal/95 backdrop-blur-md border-b border-harpy-cardBorder px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* 1. Left Section: Hamburger + Welcome Message */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
              Welcome back, <span className="text-slate-100 font-bold">J. Davenport</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald/10 text-emerald border border-emerald/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Live SP-API
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-harpy-subtle truncate">
            Harpy Growth Intelligence • Multi-Brand Analytics
          </span>
        </div>
      </div>

      {/* 2. Right Section: Brand Selector + Date Selector + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Brand Selector with All Brands Option */}
        <div className="relative" ref={brandRef}>
          <button
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-harpy-navy border border-harpy-cardBorder hover:border-slate-700 hover:bg-slate-800/80 text-xs font-medium text-slate-200 transition-all shadow-sm"
            title="Switch Brand"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald/30 to-electric/30 border border-emerald/40 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {selectedBrand?.code?.slice(0, 3) || 'ALL'}
            </div>
            <span className="hidden sm:inline font-semibold text-slate-100 truncate max-w-[120px] lg:max-w-[150px]">
              {selectedBrand?.name || 'All Brands'}
            </span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                brandDropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {brandDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-harpy-cardBorder/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Brand Filter
                </span>
              </div>
              <div className="py-1">
                {brands.map((brand) => {
                  const isSelected = selectedBrand.id === brand.id;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setBrandDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left hover:bg-slate-800/70',
                        isSelected && 'bg-slate-800/90 text-white font-semibold'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0',
                            isSelected
                              ? 'bg-emerald text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          )}
                        >
                          {brand.code}
                        </span>
                        <div className="truncate">
                          <p className="truncate text-slate-200 font-medium">{brand.name}</p>
                          <p className="text-[10px] text-harpy-subtle">{brand.category}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-harpy-navy border border-harpy-cardBorder hover:border-slate-700 hover:bg-slate-800/80 text-xs font-medium text-slate-200 transition-all shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald shrink-0" />
            <span className="hidden sm:inline">{activeDateConfig.label}</span>
            <span className="sm:hidden">{activeDateConfig.id.toUpperCase()}</span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                dateDropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-harpy-cardBorder/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Analytics Timeframe
                </span>
              </div>
              <div className="py-1">
                {dateRanges.map((opt) => {
                  const isSelected = selectedDateRange === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedDateRange(opt.id);
                        setDateDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-800/70 text-left transition-colors',
                        isSelected ? 'text-emerald font-semibold bg-slate-800/50' : 'text-slate-300'
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg bg-harpy-navy border border-harpy-cardBorder hover:bg-slate-800 hover:border-slate-700 text-slate-300 transition-colors shadow-sm"
            title="Amazon Alerts & Telemetry"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald ring-2 ring-harpy-navy animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-harpy-cardBorder/70 flex items-center justify-between bg-harpy-navy/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Amazon Performance Alerts</span>
                  {unreadCount > 0 && (
                    <Badge variant="emerald" size="xs">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-electric hover:underline font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="divide-y divide-harpy-cardBorder/40 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/alerts');
                    }}
                    className="p-3.5 hover:bg-slate-800/40 transition-colors text-left space-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            notif.severity === 'critical'
                              ? 'bg-rose-400'
                              : notif.severity === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          )}
                        />
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                          {notif.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-harpy-subtle leading-relaxed pl-3.5 line-clamp-2">
                      {notif.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-2.5 border-t border-harpy-cardBorder/70 bg-harpy-navy/80 text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/alerts');
                  }}
                  className="text-xs font-semibold text-emerald hover:text-emerald-300 flex items-center justify-center gap-1.5 w-full py-1 transition-colors"
                >
                  <span>Open Smart Alerts Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald to-electric flex items-center justify-center font-bold text-slate-950 text-xs shadow-emerald-glow shrink-0">
              JD
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-white">J. Davenport</span>
              <span className="text-[10px] text-emerald font-medium">Sr. Brand Director</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2.5 border-b border-harpy-cardBorder/60">
                <p className="text-xs font-bold text-white">J. Davenport</p>
                <p className="text-[11px] text-harpy-subtle truncate">director@harpy-media.com</p>
                <span className="inline-block mt-1 text-[10px] text-emerald bg-emerald/10 border border-emerald/20 px-1.5 py-0.5 rounded font-medium">
                  Enterprise Tier Active
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 text-left transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Team & SP-API Access</span>
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 text-left transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Amazon Developer Keys</span>
                </button>
              </div>
              <div className="pt-1 border-t border-harpy-cardBorder/60">
                <button
                  onClick={() => {
                    alert('Session logged out');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 text-left transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
