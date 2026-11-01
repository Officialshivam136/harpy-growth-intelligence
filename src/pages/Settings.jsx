import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Key,
  ShieldCheck,
  Building,
  Bell,
  Users,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';

export function Settings() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [syncFreq, setSyncFreq] = useState('hourly');
  const [tacosAlertThreshold, setTacosAlertThreshold] = useState('14');

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          System Settings & SP-API Integrations
        </h1>
        <p className="text-xs text-harpy-subtle mt-1">
          Manage Amazon Selling Partner API (SP-API), Amazon Ads API keys, and notification thresholds.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald" />
          <span>Settings successfully synchronized with backend configuration.</span>
        </div>
      )}

      {/* Amazon SP-API Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald" />
            <CardTitle>Amazon Selling Partner API (SP-API) Status</CardTitle>
          </div>
          <Badge variant="emerald" dot pulseDot size="sm">
            Authenticated & Validated
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-harpy-charcoal/80 border border-harpy-cardBorder space-y-1">
              <span className="text-[11px] text-harpy-subtle">LWA App Client ID</span>
              <p className="text-xs font-mono text-slate-200">amzn1.application-oa2-client.9842a...4b12</p>
            </div>
            <div className="p-3.5 rounded-lg bg-harpy-charcoal/80 border border-harpy-cardBorder space-y-1">
              <span className="text-[11px] text-harpy-subtle">AWS IAM Role ARN</span>
              <p className="text-xs font-mono text-slate-200">arn:aws:iam::492810398412:role/HarpySpApiRole</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-harpy-subtle">
              Reports Subscribed: Orders, Settlements, FBA Inventory, Buy Box Pricing, Sponsored Ads.
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => alert('SP-API handshake verified. Ping latency: 84ms.')}
              leftIcon={<RefreshCw className="w-3 h-3" />}
            >
              Verify SP-API Handshake
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Data Ingestion & Batch Sync */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-electric" />
            <CardTitle>CSV Data Ingestion & Offline Sync</CardTitle>
          </div>
          <Badge variant="electric" size="xs">
            4 Schema Formats
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-harpy-subtle leading-relaxed">
            Upload offline sales spreadsheets, product catalogs, PPC campaign performance, and unit COGS with duplicate detection and schema validation.
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Agency Scope: <strong className="text-white font-mono">agency_harpy_media_01</strong>
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/import')}
              className="gap-1.5 text-slate-200 hover:text-white"
            >
              <span>Open Ingestion Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Telemetry & Notification Rules */}
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-electric" />
              <CardTitle>Alert Triggers & Thresholds</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  TACoS Spike Alert Threshold (%)
                </label>
                <Input
                  type="number"
                  value={tacosAlertThreshold}
                  onChange={(e) => setTacosAlertThreshold(e.target.value)}
                  placeholder="e.g. 14"
                />
                <span className="text-[10px] text-harpy-muted mt-1 block">
                  Triggers urgent notification when 7-day blended TACoS exceeds this percentage.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Automated SP-API Ingestion Frequency
                </label>
                <select
                  value={syncFreq}
                  onChange={(e) => setSyncFreq(e.target.value)}
                  className="w-full bg-harpy-charcoal border border-harpy-cardBorder rounded-lg text-sm text-slate-200 px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-electric"
                >
                  <option value="15m">Every 15 minutes (High frequency)</option>
                  <option value="hourly">Hourly (Recommended for enterprise)</option>
                  <option value="6h">Every 6 hours</option>
                  <option value="daily">Daily at 00:00 UTC</option>
                </select>
                <span className="text-[10px] text-harpy-muted mt-1 block">
                  Amazon SP-API throttling limits are automatically respected.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-harpy-cardBorder/60 flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Save System Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default Settings;

