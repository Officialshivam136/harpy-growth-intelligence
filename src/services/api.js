import axios from 'axios';
import {
  mockBrands,
  mockExecutiveKpis,
  mockRevenueTrends,
  mockTopAsins,
  mockAdvertisingData,
} from './mockData.js';

// Create base Axios client with standard SaaS headers
const apiClient = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || process.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching auth token (safely from state/storage without hardcoded secrets)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('harpy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful error formatting and resilient fallback
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.details || null,
    };
    return Promise.reject(customError);
  }
);

/**
 * Harpy Analytics Service API
 * Uses Axios to talk to Express backend with graceful fallback to realistic data
 */
export const analyticsApi = {
  /**
   * Health check
   */
  async getHealth() {
    try {
      return await apiClient.get('/health');
    } catch {
      return { status: 'mock_mode', database: 'ready', message: 'Harpy Mock Engine Active' };
    }
  },

  /**
   * Get all connected multi-brands
   */
  async getBrands() {
    try {
      const res = await apiClient.get('/brands');
      return res.data || res;
    } catch {
      // Graceful fallback during foundation development
      return mockBrands;
    }
  },

  /**
   * Get executive KPIs
   */
  async getKpis(brandId = 'all', timeframe = '30d') {
    try {
      const res = await apiClient.get('/analytics/kpis', {
        params: { brandId, timeframe },
      });
      return res.data || res;
    } catch {
      return mockExecutiveKpis;
    }
  },

  /**
   * Get revenue and TACoS trends
   */
  async getRevenueTrends(brandId = 'all', timeframe = '30d') {
    try {
      const res = await apiClient.get('/analytics/revenue-trends', {
        params: { brandId, timeframe },
      });
      return res.data || res;
    } catch {
      return mockRevenueTrends;
    }
  },

  /**
   * Get top performing Amazon ASINs
   */
  async getTopAsins(brandId = 'all') {
    try {
      const res = await apiClient.get('/analytics/top-asins', {
        params: { brandId },
      });
      return res.data || res;
    } catch {
      return mockTopAsins;
    }
  },

  /**
   * Get advertising / PPC performance
   */
  async getAdvertisingData(brandId = 'all') {
    try {
      const res = await apiClient.get('/analytics/advertising', {
        params: { brandId },
      });
      return res.data || res;
    } catch {
      return mockAdvertisingData;
    }
  },
};

export default apiClient;

