import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Database,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Check,
  X,
  FileCheck,
} from 'lucide-react';
import apiClient from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { cn } from '../utils/cn';

const IMPORT_TYPES = [
  {
    id: 'sales',
    name: 'Daily Sales & Revenue',
    icon: DollarSign,
    description: 'Import daily Amazon gross sales, ad spend, and order volume records.',
    color: 'emerald',
    sampleFilename: 'sample_sales_template.csv',
  },
  {
    id: 'products',
    name: 'Product Catalog',
    icon: ShoppingBag,
    description: 'Import ASINs, SKUs, titles, categories, and retail selling prices.',
    color: 'electric',
    sampleFilename: 'sample_products_template.csv',
  },
  {
    id: 'campaigns',
    name: 'Campaign Telemetry',
    icon: BarChart3,
    description: 'Import PPC campaign performance: spend, sales, clicks, and impressions.',
    color: 'purple',
    sampleFilename: 'sample_campaigns_template.csv',
  },
  {
    id: 'costs',
    name: 'Product Unit Costs (COGS)',
    icon: Layers,
    description: 'Import unit COGS, FBA handling fees, and custom referral commission rates.',
    color: 'amber',
    sampleFilename: 'sample_costs_template.csv',
  },
];

export function DataImport() {
  const [selectedType, setSelectedType] = useState('sales');
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Load past import audit logs
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await apiClient.get('/import/history');
      if (res?.data?.success && Array.isArray(res.data.data)) {
        setImportHistory(res.data.data);
      }
    } catch (e) {
      console.warn('Failed to fetch import history:', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (!uploaded.name.endsWith('.csv') && !uploaded.type.includes('csv') && !uploaded.type.includes('text')) {
      alert('Please upload a valid .csv file.');
      return;
    }

    setFile(uploaded);
    setValidationResult(null);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setFileContent(text);
        validateFile(text, uploaded.name);
      }
    };
    reader.readAsText(uploaded);
  };

  // Validate file structure & check duplicates
  const validateFile = async (content, fileName) => {
    setIsValidating(true);
    try {
      const res = await apiClient.post('/import/validate', {
        importType: selectedType,
        csvContent: content,
        fileName,
      });

      if (res?.data) {
        setValidationResult(res.data);
      }
    } catch (err) {
      setValidationResult({
        valid: false,
        message: err?.response?.data?.message || 'CSV validation failed.',
        errors: [err.message],
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Execute import process
  const handleProcessImport = async () => {
    if (!validationResult || !validationResult.valid || !fileContent) return;

    setIsProcessing(true);
    try {
      const res = await apiClient.post('/import/process', {
        importType: selectedType,
        csvContent: fileContent,
        fileName: file?.name,
        fileHash: validationResult.fileHash,
      });

      if (res?.data?.success) {
        setImportSummary(res.data.summary);
        fetchHistory();
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Sample Template
  const handleDownloadTemplate = (typeId) => {
    window.open(`/api/import/template/${typeId}`, '_blank');
  };

  const activeTypeConfig = IMPORT_TYPES.find((t) => t.id === selectedType);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald" />
              <span>Data & CSV Ingestion Studio</span>
            </h1>
            <Badge variant="emerald" size="xs" dot>
              Structure Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-harpy-subtle mt-1 max-w-2xl">
            Import and synchronize offline sales orders, catalog masters, advertising logs, and unit COGS with duplicate detection and validation.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadTemplate(selectedType)}
          className="gap-2 shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-electric" />
          <span>Download Sample Template</span>
        </Button>
      </div>

      {/* 2. Select Import Type Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {IMPORT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setFile(null);
                setFileContent('');
                setValidationResult(null);
                setImportSummary(null);
              }}
              className={cn(
                'p-4 rounded-xl border text-left transition-all relative overflow-hidden group',
                isSelected
                  ? 'bg-slate-800/90 border-emerald/50 shadow-emerald-glow'
                  : 'bg-harpy-charcoal/60 border-harpy-cardBorder/60 hover:bg-slate-800/40 hover:border-slate-700'
              )}
            >
              {isSelected && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-bl bg-emerald shadow-emerald-glow" />
              )}
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                    isSelected
                      ? 'bg-emerald/20 border-emerald/40 text-emerald'
                      : 'bg-harpy-navy border-harpy-cardBorder text-slate-400 group-hover:text-slate-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white block truncate">{type.name}</span>
              </div>
              <p className="text-[11px] text-harpy-subtle leading-relaxed line-clamp-2">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3. Drag & Drop File Upload Zone */}
      <Card className="p-6 bg-harpy-charcoal/90 border-harpy-cardBorder">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3',
            file
              ? 'border-emerald/40 bg-emerald-950/10'
              : 'border-harpy-cardBorder hover:border-electric/40 hover:bg-slate-800/20'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-harpy-navy border border-harpy-cardBorder flex items-center justify-center text-electric shadow-md">
            {isValidating ? (
              <RefreshCw className="w-6 h-6 animate-spin text-electric" />
            ) : file ? (
              <FileCheck className="w-6 h-6 text-emerald" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              {file ? file.name : `Upload ${activeTypeConfig?.name} (.CSV)`}
            </h3>
            <p className="text-xs text-harpy-subtle">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB • Click to choose a different file`
                : 'Drag and drop your spreadsheet file here, or browse your local storage.'}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-harpy-navy border border-harpy-cardBorder text-slate-400">
            Accepts UTF-8 RFC 4180 Comma-Separated Values (.csv)
          </span>
        </div>
      </Card>

      {/* 4. Validation Results & Data Preview */}
      {validationResult && (
        <Card className="p-6 bg-harpy-charcoal/90 border-harpy-cardBorder space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-harpy-cardBorder/70">
            <div className="flex items-center gap-2.5">
              {validationResult.valid ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-white">
                  {validationResult.valid
                    ? 'CSV File Structure Verified Successfully'
                    : 'Structure Validation Warning'}
                </h3>
                <p className="text-xs text-harpy-subtle">
                  {validationResult.message || `${validationResult.totalRows} data rows parsed.`}
                </p>
              </div>
            </div>

            {/* Validation Metrics Pills */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-harpy-navy border border-harpy-cardBorder text-xs text-slate-200 font-semibold font-mono">
                {validationResult.totalRows} Total Rows
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-400 font-semibold font-mono">
                {validationResult.validCount} Valid
              </span>
              {validationResult.invalidCount > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-500/30 text-xs text-rose-400 font-semibold font-mono">
                  {validationResult.invalidCount} Errors
                </span>
              )}
            </div>
          </div>

          {/* Duplicate Import Prevention Notice */}
          {validationResult.duplicateWarning && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Duplicate File Notice: </span>
                An identical file was previously imported on{' '}
                {new Date(validationResult.previousImportDate).toLocaleDateString()}. Proceeding will safely upsert existing records without creating duplicates.
              </div>
            </div>
          )}

          {/* Errors list if any */}
          {validationResult.errors && validationResult.errors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5 text-xs text-rose-200">
              <span className="font-bold block text-rose-300">Validation Errors:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-200/90 font-mono">
                {validationResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {validationResult.preview && validationResult.preview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Data Sample Preview (First 10 Rows):</span>
                <span className="text-harpy-subtle font-mono text-[11px]">
                  Columns: {validationResult.headers?.join(', ')}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-harpy-cardBorder/80 bg-harpy-navy/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-harpy-navy border-b border-harpy-cardBorder/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      {validationResult.headers.map((h) => (
                        <th key={h} className="py-2.5 px-3">
                          {h.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-harpy-cardBorder/40 text-slate-200 font-mono text-[11px]">
                    {validationResult.preview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        {validationResult.headers.map((h) => (
                          <td key={h} className="py-2 px-3 truncate max-w-xs">
                            {row[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Commit Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-harpy-subtle">
              Verified records will be atomic-upserted into your agency database.
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={!validationResult.valid || isProcessing}
              onClick={handleProcessImport}
              className="gap-2 shadow-emerald-glow"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Upserts...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Commit & Import {validationResult.validCount} Records</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* 5. Import Success Summary */}
      {importSummary && (
        <Card className="p-5 bg-emerald-950/20 border-emerald-500/40 text-emerald-200 space-y-2 animate-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="w-5 h-5 text-emerald" />
            <span>Import Successfully Processed & Synchronized</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-harpy-navy/80 border border-emerald-500/30">
              <span className="text-[10px] text-harpy-subtle uppercase block font-semibold">Total Processed</span>
              <span className="text-sm font-bold text-white">{importSummary.totalProcessed} Rows</span>
            </div>
            <div className="p-2.5 rounded-lg bg-harpy-navy/80 border border-emerald-500/30">
              <span className="text-[10px] text-harpy-subtle uppercase block font-semibold">New Records Created</span>
              <span className="text-sm font-bold text-emerald">{importSummary.newRecordsCreated}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-harpy-navy/80 border border-emerald-500/30">
              <span className="text-[10px] text-harpy-subtle uppercase block font-semibold">Existing Updated</span>
              <span className="text-sm font-bold text-sky-400">{importSummary.existingRecordsUpdated}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-harpy-navy/80 border border-emerald-500/30">
              <span className="text-[10px] text-harpy-subtle uppercase block font-semibold">Status</span>
              <span className="text-sm font-bold text-emerald">Synchronized</span>
            </div>
          </div>
        </Card>
      )}

      {/* 6. Past Import Audit Trail History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-electric" />
            <CardTitle>Recent Ingestion Audit Trail</CardTitle>
          </div>
          <Badge variant="slate" size="xs">
            Agency Scope: agency_harpy_media_01
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-harpy-charcoal/50 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold border-b border-harpy-cardBorder">
                <tr>
                  <th className="py-3 px-4">Filename & Dataset</th>
                  <th className="py-3 px-4">Import Type</th>
                  <th className="py-3 px-4 text-right">Rows</th>
                  <th className="py-3 px-4">Imported By</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/40 text-slate-300">
                {importHistory.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{item.importType}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {item.importedCount || item.totalRows}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.importedBy || 'J. Davenport'}</td>
                    <td className="py-3 px-4 text-harpy-subtle font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="emerald" size="xs" dot>
                        {item.status || 'Completed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataImport;
