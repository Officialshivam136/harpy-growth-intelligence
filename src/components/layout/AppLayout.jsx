import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-harpy-navy text-slate-100 flex flex-col font-sans selection:bg-electric/20 selection:text-electric-light">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-electric/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-emerald/5 rounded-full blur-[140px]" />
      </div>

      <div className="flex flex-1 relative z-10 min-h-screen">
        {/* Responsive Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content Area */}
        <div
          className={cn(
            'flex flex-col flex-1 min-w-0 transition-all duration-300',
            collapsed ? 'lg:pl-20' : 'lg:pl-64'
          )}
        >
          {/* Top Sticky Header */}
          <Header setMobileOpen={setMobileOpen} />

          {/* Dynamic Page Views */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>

          {/* Enterprise Footer */}
          <footer className="border-t border-harpy-cardBorder/60 py-4 px-6 text-xs text-harpy-muted flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span>Harpy Growth Intelligence v1.0.0</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                Amazon SP-API Connected (US, EU, FE)
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-slate-300 cursor-pointer">Security & Encryption</span>
              <span className="hover:text-slate-300 cursor-pointer">API Docs</span>
              <span>© {new Date().getFullYear()} Harpy Media Inc.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;

