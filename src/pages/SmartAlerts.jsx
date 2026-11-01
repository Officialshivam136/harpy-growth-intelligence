import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCheck,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { AlertCard } from '../components/alerts/AlertCard';
import { AlertResolutionModal } from '../components/alerts/AlertResolutionModal';
import { AlertRuleConfigDrawer } from '../components/alerts/AlertRuleConfigDrawer';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ALERT_TYPES } from '../services/alertService';
import { cn } from '../utils/cn';

export function SmartAlerts() {
  const {
    brands,
    selectedBrand,
    setSelectedBrand,
    alerts,
    alertRules,
    alertStats,
    markAlertAsRead,
    markAllAlertsAsRead,
    resolveAlert,
    reopenAlert,
    updateAlertRule,
    refreshAlerts,
    alertsLoading,
  } = useBrand();

  // Local Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all'); // 'all' | 'critical' | 'warning' | 'info'
  const [selectedStatusTab, setSelectedStatusTab] = useState('active'); // 'active' | 'resolved' | 'all'
  const [selectedType, setSelectedType] = useState('all');

  // Modals & Drawers
  const [resolvingAlert, setResolvingAlert] = useState(null);
  const [isRulesDrawerOpen, setIsRulesDrawerOpen] = useState(false);

  // Filter alerts based on current selections
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // 1. Status Filter
      if (selectedStatusTab === 'active' && alert.status !== 'active') return false;
      if (selectedStatusTab === 'resolved' && alert.status !== 'resolved') return false;

      // 2. Brand Filter
      if (selectedBrand && selectedBrand.id !== 'all' && alert.brandId !== selectedBrand.id) {
        return false;
      }

      // 3. Severity Filter
      if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
        return false;
      }

      // 4. Alert Type Filter
      if (selectedType !== 'all' && alert.type !== selectedType) {
        return false;
      }

      // 5. Text Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = alert.title.toLowerCase().includes(q);
        const matchesEntity = alert.entityName.toLowerCase().includes(q);
        const matchesReason = alert.reason.toLowerCase().includes(q);
        const matchesBrand = alert.brandName.toLowerCase().includes(q);
        const matchesMetric = alert.metricAffected.toLowerCase().includes(q);
        if (!matchesTitle && !matchesEntity && !matchesReason && !matchesBrand && !matchesMetric) {
          return false;
        }
      }

      return true;
    });
  }, [alerts, selectedStatusTab, selectedBrand, selectedSeverity, selectedType, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Smart Performance Alerts
            </h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald/10 text-emerald border border-emerald/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Automated Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-harpy-subtle mt-1 max-w-3xl">
            Continuously monitors actual Amazon advertising spend surges, ROAS drops, target ACOS breaches, revenue contractions, and product contribution margins.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRulesDrawerOpen(true)}
            className="gap-2"
          >
            <Sliders className="w-3.5 h-3.5 text-electric" />
            <span>Rules & Thresholds</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAlertsAsRead}
            disabled={alertStats.unreadCount === 0}
            className="gap-2 text-slate-300 hover:text-white"
          >
            <CheckCheck className="w-4 h-4 text-emerald" />
            <span>Mark All Read</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={refreshAlerts}
            disabled={alertsLoading}
            className="gap-2"
            title="Refresh alerts against latest telemetry"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', alertsLoading && 'animate-spin text-electric')} />
            <span>Re-evaluate</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Alerts */}
        <Card className="p-4 sm:p-5 border-harpy-cardBorder/80 bg-harpy-card/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-harpy-subtle">Total Active Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-electric/10 border border-electric/25 flex items-center justify-center text-electric">
              <BellRing className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{alertStats.activeCount}</span>
            <span className="text-xs text-slate-400 font-medium">
              {selectedBrand?.id === 'all' ? 'All Brands' : selectedBrand?.name}
            </span>
          </div>
        </Card>

        {/* Critical Issues */}
        <Card className="p-4 sm:p-5 border-rose-500/25 bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Critical Issues</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400">{alertStats.criticalCount}</span>
            <span className="text-[11px] text-rose-300/80 font-medium">Immediate Action</span>
          </div>
        </Card>

        {/* Warnings */}
        <Card className="p-4 sm:p-5 border-amber-500/25 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">Warning Level</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{alertStats.warningCount}</span>
            <span className="text-[11px] text-amber-300/80 font-medium">Nearing Threshold</span>
          </div>
        </Card>

        {/* Resolved This Period */}
        <Card className="p-4 sm:p-5 border-emerald-500/25 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Resolved History</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{alertStats.resolvedCount}</span>
            <span className="text-[11px] text-emerald-300/80 font-medium">Actions Verified</span>
          </div>
        </Card>
      </div>

      {/* 3. Filters and Search Control Panel */}
      <Card className="p-4 bg-harpy-charcoal/80 border-harpy-cardBorder space-y-4">
        {/* Status Tabs (Active, Resolved, All) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-harpy-cardBorder/60 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-harpy-navy border border-harpy-cardBorder/70 text-xs">
            <button
              onClick={() => setSelectedStatusTab('active')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg font-bold transition-all',
                selectedStatusTab === 'active'
                  ? 'bg-slate-800 text-white shadow-sm border border-harpy-cardBorder/80'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Active Alerts ({alertStats.activeCount})
            </button>

            <button
              onClick={() => setSelectedStatusTab('resolved')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg font-bold transition-all',
                selectedStatusTab === 'resolved'
                  ? 'bg-slate-800 text-white shadow-sm border border-harpy-cardBorder/80'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Resolved History ({alertStats.resolvedCount})
            </button>

            <button
              onClick={() => setSelectedStatusTab('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg font-bold transition-all',
                selectedStatusTab === 'all'
                  ? 'bg-slate-800 text-white shadow-sm border border-harpy-cardBorder/80'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              All Telemetry
            </button>
          </div>

          {/* Quick Clear Filters */}
          {(searchQuery || selectedSeverity !== 'all' || selectedType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('all');
                setSelectedType('all');
              }}
              className="text-xs text-electric hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, campaign, metric, or reason..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-harpy-navy border border-harpy-cardBorder text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-harpy-navy border border-harpy-cardBorder/60 text-xs">
              <button
                onClick={() => setSelectedSeverity('all')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold transition-colors',
                  selectedSeverity === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                All Severities
              </button>
              <button
                onClick={() => setSelectedSeverity('critical')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold transition-colors',
                  selectedSeverity === 'critical'
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                    : 'text-rose-400/70 hover:text-rose-300'
                )}
              >
                Critical
              </button>
              <button
                onClick={() => setSelectedSeverity('warning')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-semibold transition-colors',
                  selectedSeverity === 'warning'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                    : 'text-amber-400/70 hover:text-amber-300'
                )}
              >
                Warning
              </button>
            </div>

            {/* Alert Type Selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-harpy-navy border border-harpy-cardBorder text-slate-200 focus:outline-none focus:border-emerald"
            >
              <option value="all">All Alert Types (7)</option>
              <option value={ALERT_TYPES.AD_SPEND_SPIKE}>Ad Spend Spike (&gt;30%)</option>
              <option value={ALERT_TYPES.ROAS_DECLINE}>ROAS Decline (&gt;20%)</option>
              <option value={ALERT_TYPES.ACOS_ABOVE_TARGET}>ACOS Above Target</option>
              <option value={ALERT_TYPES.TACOS_INCREASE}>TACOS Increase</option>
              <option value={ALERT_TYPES.REVENUE_DECLINE}>Revenue Decline (&gt;20%)</option>
              <option value={ALERT_TYPES.LOW_PRODUCT_PROFITABILITY}>Low Product Profitability</option>
              <option value={ALERT_TYPES.CAMPAIGN_DETERIORATION}>Campaign Deterioration</option>
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand?.id || 'all'}
              onChange={(e) => {
                const found = brands.find((b) => b.id === e.target.value) || brands[0];
                setSelectedBrand(found);
              }}
              className="px-3 py-2 text-xs rounded-lg bg-harpy-navy border border-harpy-cardBorder text-slate-200 focus:outline-none focus:border-emerald"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 4. Alert List Feed */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkRead={markAlertAsRead}
              onResolveClick={(a) => setResolvingAlert(a)}
              onReopen={reopenAlert}
            />
          ))
        ) : (
          <EmptyState
            title={
              selectedStatusTab === 'resolved'
                ? 'No resolved alerts yet'
                : 'No performance alerts match your filters'
            }
            description={
              selectedStatusTab === 'resolved'
                ? 'When performance issues are corrected and resolved by brand managers, they appear in this audit history.'
                : 'All configured Amazon telemetry metrics and unit economics are currently within acceptable variance tolerances.'
            }
            actionLabel="Reset Active Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSeverity('all');
              setSelectedType('all');
              setSelectedStatusTab('active');
            }}
          />
        )}
      </div>

      {/* 5. Modals and Drawers */}
      <AlertResolutionModal
        isOpen={!!resolvingAlert}
        alert={resolvingAlert}
        onClose={() => setResolvingAlert(null)}
        onResolve={resolveAlert}
      />

      <AlertRuleConfigDrawer
        isOpen={isRulesDrawerOpen}
        rules={alertRules}
        onClose={() => setIsRulesDrawerOpen(false)}
        onUpdateRule={updateAlertRule}
      />
    </div>
  );
}

export default SmartAlerts;
