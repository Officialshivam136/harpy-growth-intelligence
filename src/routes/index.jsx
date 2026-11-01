import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardOverview } from '../pages/DashboardOverview';
import { BrandsPortfolio } from '../pages/BrandsPortfolio';
import { BrandWorkspacePage } from '../pages/BrandWorkspacePage';
import { SalesAnalytics } from '../pages/SalesAnalytics';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { AdvertisingPpc } from '../pages/AdvertisingPpc';
import { SmartAlerts } from '../pages/SmartAlerts';
import { ClientReporting } from '../pages/ClientReporting';
import { AiGrowthAnalyst } from '../pages/AiGrowthAnalyst';
import { InventoryHealth } from '../pages/InventoryHealth';
import { DataImport } from '../pages/DataImport';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="brands" element={<BrandsPortfolio />} />
        <Route path="brands/:brandId" element={<BrandWorkspacePage />} />
        <Route path="analytics" element={<SalesAnalytics />} />
        <Route path="analytics/:asin" element={<ProductDetailPage />} />
        <Route path="advertising" element={<AdvertisingPpc />} />
        <Route path="alerts" element={<SmartAlerts />} />
        <Route path="reports" element={<ClientReporting />} />
        <Route path="analyst" element={<AiGrowthAnalyst />} />
        <Route path="inventory" element={<InventoryHealth />} />
        <Route path="import" element={<DataImport />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

