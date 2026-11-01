import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Calendar,
  Building2,
  Sliders,
  Sparkles,
  Eye,
  Edit3,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { generateBrandReport, REPORT_PERIODS } from '../services/reportService';
import { ClientReportDocument } from '../components/reports/ClientReportDocument';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { cn } from '../utils/cn';

export function ClientReporting() {
  const { brands, selectedBrand, setSelectedBrand } = useBrand();

  // Selected brand ID (defaults to first real brand if 'all' is selected)
  const [reportBrandId, setReportBrandId] = useState(() => {
    if (selectedBrand && selectedBrand.id !== 'all') return selectedBrand.id;
    return 'village-company';
  });

  const [selectedPeriodId, setSelectedPeriodId] = useState('7d');
  const [customCommentary, setCustomCommentary] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Generate dynamic report data based on user choices
  const report = useMemo(() => {
    return generateBrandReport(reportBrandId, selectedPeriodId, customCommentary);
  }, [reportBrandId, selectedPeriodId, customCommentary]);

  // Synchronize when global brand changes
  const handleBrandChange = (e) => {
    const val = e.target.value;
    setReportBrandId(val);
    const matched = brands.find((b) => b.id === val);
    if (matched) setSelectedBrand(matched);
  };

  // 1. Export PDF (Browser Native Print to PDF)
  const handleExportPdf = () => {
    window.print();
  };

  // 2. Download Standalone HTML Report File
  const handleDownloadHtml = () => {
    setIsExporting(true);
    try {
      const docElement = document.getElementById('client-report-document');
      if (!docElement) return;

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.meta.reportId} - ${report.brand.name} Performance Report</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body { padding: 0; background: #fff; }
      @page { size: letter portrait; margin: 1cm; }
    }
  </style>
</head>
<body class="bg-slate-100 p-4 sm:p-8 font-sans">
  <div class="max-w-4xl mx-auto">
    ${docElement.outerHTML}
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.meta.reportId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report HTML:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Copy Summary Markdown to Clipboard
  const handleCopySummary = () => {
    const summaryText = `
# ${report.brand.name} — ${report.period.label}
**Report ID:** ${report.meta.reportId} | **Cycle:** ${report.period.reportingPeriodStr}
**Account Lead:** ${report.meta.accountLead}

## Financial Scorecard:
- Total Revenue (GMV): ${report.executiveSummary.kpiCards.totalRevenue.value} (${report.executiveSummary.kpiCards.totalRevenue.change} vs prior)
- Advertising Spend: ${report.executiveSummary.kpiCards.adSpend.value}
- Attributed ROAS: ${report.executiveSummary.kpiCards.roas.value}
- ACOS: ${report.executiveSummary.kpiCards.acos.value} (Target: ${report.brand.targetAcos}%)
- TACoS: ${report.executiveSummary.kpiCards.tacos.value} (Target: ${report.brand.targetTacos}%)
- Total Orders: ${report.executiveSummary.kpiCards.totalOrders.value}
- Estimated Contribution Profit: ${report.executiveSummary.kpiCards.estimatedProfit.value} (${report.executiveSummary.kpiCards.estimatedProfit.margin})

## Major Accomplishments:
${report.majorImprovements.map((i) => `- ${i.title}: ${i.detail}`).join('\n')}

## Critical Focus Areas:
${report.problemsIdentified.map((p) => `- ${p.title} (${p.metric}): ${p.detail}`).join('\n')}

## Next Week's Priorities:
${report.nextWeekPriorities.map((item) => `- [${item.priority}] ${item.task} (Owner: ${item.owner}, Timeline: ${item.timeline})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 1. Header Toolbar (Hidden during print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Weekly Client Performance Reporting
            </h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald/10 text-emerald border border-emerald/25">
              <Sparkles className="w-3.5 h-3.5" />
              Agency Export Studio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-harpy-subtle mt-1 max-w-2xl">
            Generate polished, data-driven executive performance reports for each brand portfolio with unit economics, campaign audits, and action plans.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopySummary}
            className="gap-1.5 text-slate-300 hover:text-white"
            title="Copy executive summary markdown for client emails or Slack"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald" />
                <span className="text-emerald">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadHtml}
            disabled={isExporting}
            className="gap-1.5"
            title="Download standalone HTML report archive"
          >
            <Download className="w-3.5 h-3.5 text-electric" />
            <span>Download HTML</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportPdf}
            className="gap-2 shadow-emerald-glow"
            title="Export high-resolution PDF document"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* 2. Studio Configuration Control Bar (Hidden during print) */}
      <Card className="no-print p-4 sm:p-5 bg-harpy-charcoal/90 border-harpy-cardBorder space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Brand Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald" />
              <span>Select Client Brand:</span>
            </label>
            <select
              value={reportBrandId}
              onChange={handleBrandChange}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-harpy-navy border border-harpy-cardBorder text-slate-100 focus:outline-none focus:border-emerald"
            >
              {brands
                .filter((b) => b.id !== 'all')
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code}) — {b.marketplace}
                  </option>
                ))}
            </select>
          </div>

          {/* Reporting Period Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-electric" />
              <span>Reporting Timeframe:</span>
            </label>
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-harpy-navy border border-harpy-cardBorder text-slate-100 focus:outline-none focus:border-emerald"
            >
              {REPORT_PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Report Metadata Status */}
          <div className="space-y-1">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-harpy-subtle">
              Audit Period Range
            </span>
            <div className="text-xs font-semibold text-slate-200 truncate">
              {report.period.reportingPeriodStr}
            </div>
            <div className="text-[10px] text-harpy-subtle font-mono truncate">
              ID: {report.meta.reportId}
            </div>
          </div>

          {/* Toggle Commentary Customization */}
          <div className="flex items-center gap-2">
            <Button
              variant={isEditingNotes ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsEditingNotes(!isEditingNotes)}
              className="w-full gap-2 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingNotes ? 'Close Note Editor' : 'Custom Commentary'}</span>
            </Button>
          </div>
        </div>

        {/* Optional Custom Commentary Textarea */}
        {isEditingNotes && (
          <div className="pt-3 border-t border-harpy-cardBorder/60 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                Custom Executive Commentary (Overrides default AI generated notes):
              </label>
              <button
                onClick={() => setCustomCommentary('')}
                className="text-[11px] text-electric hover:underline"
              >
                Reset to Automated Default
              </button>
            </div>
            <textarea
              rows={3}
              value={customCommentary}
              onChange={(e) => setCustomCommentary(e.target.value)}
              placeholder="Add personalized agency strategic observations, festive inventory updates, or special partner milestones..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-harpy-navy border border-harpy-cardBorder text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald transition-colors"
            />
          </div>
        )}
      </Card>

      {/* 3. Document Canvas Container */}
      <div className="relative py-4 sm:py-6 flex justify-center bg-slate-950/40 rounded-2xl border border-harpy-cardBorder/40">
        <ClientReportDocument report={report} />
      </div>
    </div>
  );
}

export default ClientReporting;

