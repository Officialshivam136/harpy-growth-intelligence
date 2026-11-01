import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  DEMO_BRANDS,
  DATE_RANGES,
  getDashboardAnalytics,
} from '../services/dashboardDataService';
import { mockMarketplaces } from '../services/mockData';
import { alertService } from '../services/alertService';

const BrandContext = createContext();

export function BrandProvider({ children }) {
  const [brands, setBrands] = useState(DEMO_BRANDS);
  const [selectedBrand, setSelectedBrand] = useState(DEMO_BRANDS[0]); // Defaults to 'all'
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedMarketplace, setSelectedMarketplace] = useState(mockMarketplaces[0]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('4m ago');

  // Smart Alerts State
  const [alerts, setAlerts] = useState(() => alertService.alerts || []);
  const [alertRules, setAlertRules] = useState(() => alertService.getRules() || []);
  const [alertsLoading, setAlertsLoading] = useState(false);

  // Sync alerts from service
  const refreshAlerts = useCallback(async () => {
    setAlertsLoading(true);
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (e) {
      console.warn('Failed to refresh alerts:', e);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  // Compute dynamic alert counts
  const alertStats = useMemo(() => {
    // Filter alerts applicable to currently selected brand, or all
    const relevant = selectedBrand?.id === 'all'
      ? alerts
      : alerts.filter((a) => a.brandId === selectedBrand.id);

    const active = relevant.filter((a) => a.status === 'active');
    const critical = active.filter((a) => a.severity === 'critical').length;
    const warning = active.filter((a) => a.severity === 'warning').length;
    const unread = relevant.filter((a) => !a.isRead).length;
    const resolved = relevant.filter((a) => a.status === 'resolved').length;

    // Also compute global total active across all brands for sidebar notification
    const globalActive = alerts.filter((a) => a.status === 'active').length;
    const globalCritical = alerts.filter((a) => a.status === 'active' && a.severity === 'critical').length;
    const globalUnread = alerts.filter((a) => !a.isRead).length;

    return {
      activeCount: active.length,
      criticalCount: critical,
      warningCount: warning,
      unreadCount: unread,
      resolvedCount: resolved,
      globalActiveCount: globalActive,
      globalCriticalCount: globalCritical,
      globalUnreadCount: globalUnread,
    };
  }, [alerts, selectedBrand?.id]);

  // Alert action handlers
  const markAlertAsRead = async (id) => {
    await alertService.markAsRead(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const markAllAlertsAsRead = async () => {
    await alertService.markAllAsRead(selectedBrand?.id || 'all');
    setAlerts((prev) =>
      prev.map((a) => {
        if (!selectedBrand || selectedBrand.id === 'all' || a.brandId === selectedBrand.id) {
          return { ...a, isRead: true };
        }
        return a;
      })
    );
  };

  const resolveAlert = async (id, resolutionNotes = 'Action taken by manager') => {
    await alertService.resolveAlert(id, resolutionNotes);
    const now = new Date().toISOString();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'resolved',
              isRead: true,
              resolvedAt: now,
              resolvedBy: 'J. Davenport',
              resolutionNotes,
            }
          : a
      )
    );
  };

  const reopenAlert = async (id) => {
    await alertService.reopenAlert(id);
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'active',
              resolvedAt: null,
              resolvedBy: null,
              resolutionNotes: null,
            }
          : a
      )
    );
  };

  const updateAlertRule = (ruleId, updates) => {
    const updated = alertService.updateRule(ruleId, updates);
    setAlertRules(updated);
    setAlerts([...alertService.alerts]);
  };

  // Compute cohesive dashboard analytics dynamically from the underlying dataset
  const analyticsData = useMemo(() => {
    return getDashboardAnalytics(selectedBrand.id, selectedDateRange);
  }, [selectedBrand.id, selectedDateRange]);

  const triggerSpApiSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
      refreshAlerts();
    }, 1200);
  };

  const value = {
    brands,
    setBrands,
    selectedBrand,
    setSelectedBrand,
    dateRanges: DATE_RANGES,
    selectedDateRange,
    setSelectedDateRange,
    marketplaces: mockMarketplaces,
    selectedMarketplace,
    setSelectedMarketplace,
    selectedCurrency,
    setSelectedCurrency,
    isSyncing,
    lastSyncTime,
    triggerSpApiSync,
    analyticsData,
    // Smart Alerts Exports
    alerts,
    alertRules,
    alertsLoading,
    alertStats,
    refreshAlerts,
    markAlertAsRead,
    markAllAlertsAsRead,
    resolveAlert,
    reopenAlert,
    updateAlertRule,
    // Header notifications backward compatibility mapped to smart alerts
    notifications: alerts.slice(0, 5).map((a) => ({
      id: a.id,
      title: a.title,
      description: a.reason,
      time: a.relativeTime,
      unread: !a.isRead,
      severity: a.severity,
      brandCode: a.brandCode,
    })),
    markAllNotificationsRead: markAllAlertsAsRead,
  };

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}

export default BrandContext;
