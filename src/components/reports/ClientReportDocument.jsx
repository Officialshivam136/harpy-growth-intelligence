import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Clock,
  CheckSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export function ClientReportDocument({ report }) {
  if (!report) return null;

  const {
    meta,
    brand,
    period,
    executiveSummary,
    chartHistory,
    brandProducts,
    topRevenueProduct,
    topProfitProduct,
    lowMarginProduct,
    brandCampaigns,
    majorImprovements,
    problemsIdentified,
    recommendations,
    nextWeekPriorities,
    dataLimitations,
  } = report;

  const kpis = executiveSummary.kpiCards;
  const currSym = brand.currencySymbol;

  return (
    <div
      id="client-report-document"
      className="bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 p-8 sm:p-12 max-w-4xl mx-auto space-y-10 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:rounded-none"
    >
      {/* 1. AGENCY LETTERHEAD & REPORT HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900/90 gap-6">
        {/* Agency Brand Emblem */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
                <path
                  d="M10 26L18 10L23 20L30 14L24 30L16 24L10 26Z"
                  fill="#38BDF8"
                  stroke="#0284C7"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="20" r="2.5" fill="#22C55E" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-950">HARPY</span>
                <span className="text-[11px] font-extrabold tracking-wider bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded">
                  GROWTH INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {meta.agencyDivision}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Account Director: <span className="font-semibold text-slate-900">{meta.accountLead}</span>
          </p>
        </div>

        {/* Client Brand & Metadata */}
        <div className="text-left sm:text-right space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
            <span className="text-base leading-none">{brand.flag}</span>
            <span>{brand.marketplace}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">{brand.name}</h2>
          <p className="text-xs font-medium text-slate-500 font-mono">
            Report ID: {meta.reportId}
          </p>
          <p className="text-xs text-slate-600">
            Published: <span className="font-semibold text-slate-900">{meta.generatedDateStr}</span>
          </p>
        </div>
      </div>

      {/* 2. REPORT TITLE & EXECUTIVE OVERVIEW */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-700">
              Executive Performance Audit
            </span>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              {period.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Cycle: {period.reportingPeriodStr}</span>
          </div>
        </div>

        {/* Executive Summary Statement */}
        <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
          <span className="font-bold text-sky-950 block mb-1">Executive Commentary:</span>
          {executiveSummary.customNotes}
        </div>
      </div>

      {/* 3. EXECUTIVE FINANCIAL SCORECARD (7 Core KPIs) */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Financial Scorecard & Advertising Efficiency
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {kpis.totalRevenue.title}
            </span>
            <div className="text-lg font-black text-slate-950 mt-1">
              {kpis.totalRevenue.value}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{kpis.totalRevenue.change} vs prior</span>
            </div>
          </div>

          {/* Ad Spend */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {kpis.adSpend.title}
            </span>
            <div className="text-lg font-black text-slate-950 mt-1">
              {kpis.adSpend.value}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mt-0.5">
              <span>{kpis.adSpend.change} vs prior</span>
            </div>
          </div>

          {/* ROAS */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {kpis.roas.title}
            </span>
            <div className="text-lg font-black text-slate-950 mt-1">
              {kpis.roas.value}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              <span>Target: ≥ 4.0x</span>
            </div>
          </div>

          {/* Estimated Contribution Profit */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              {kpis.estimatedProfit.title}
            </span>
            <div className="text-lg font-black text-emerald-950 mt-1">
              {kpis.estimatedProfit.value}
            </div>
            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
              <span>{kpis.estimatedProfit.margin}</span>
            </div>
          </div>

          {/* ACOS */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {kpis.acos.title}
            </span>
            <div className="text-lg font-black text-slate-950 mt-1">
              {kpis.acos.value}
            </div>
            <div className="text-[11px] font-medium text-slate-600 mt-0.5">
              <span>{kpis.acos.target}</span>
            </div>
          </div>

          {/* TACoS */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {kpis.tacos.title}
            </span>
            <div className="text-lg font-black text-slate-950 mt-1">
              {kpis.tacos.value}
            </div>
            <div className="text-[11px] font-medium text-slate-600 mt-0.5">
              <span>{kpis.tacos.target}</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              {kpis.totalOrders.title}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-black text-slate-950">
                {kpis.totalOrders.value} Units
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {kpis.totalOrders.aov}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              <span>{kpis.totalOrders.change} Conversion Lift</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE TRAJECTORY VISUALIZATION */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-600" />
          Revenue vs Ad Spend Trajectory
        </h3>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartHistory}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(v) => `${currSym}${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val, name) => [
                    `${currSym}${val.toLocaleString()}`,
                    name === 'revenue' ? 'Gross Revenue' : name === 'adSpend' ? 'Ad Spend' : 'Contribution Profit',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Gross Revenue"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: '#0284C7' }}
                />
                <Line
                  type="monotone"
                  dataKey="adSpend"
                  name="Ad Spend"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#F59E0B' }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Contribution Profit"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#16A34A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. PRODUCT PERFORMANCE & UNIT ECONOMICS */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-900" />
          Product Catalog & Unit Economics Breakdown
        </h3>

        {/* Product Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topRevenueProduct && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                Top Revenue Hero SKU
              </span>
              <p className="text-xs font-bold text-slate-900 truncate mt-1">
                {topRevenueProduct.sku}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Revenue: <span className="font-semibold text-slate-900">{currSym}{topRevenueProduct.totalRevenue.toLocaleString()}</span>
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold">
                Buy Box: {topRevenueProduct.buyBoxWinRate}% • BSR #{topRevenueProduct.bsr}
              </p>
            </div>
          )}

          {topProfitProduct && (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Highest Profit Contribution
              </span>
              <p className="text-xs font-bold text-slate-900 truncate mt-1">
                {topProfitProduct.sku}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Profit: <span className="font-semibold text-emerald-900">{currSym}{topProfitProduct.contributionProfit.toLocaleString()}</span>
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold">
                Margin: {topProfitProduct.contributionMargin}%
              </p>
            </div>
          )}

          {lowMarginProduct && (
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                Margin Sensitivity Attention
              </span>
              <p className="text-xs font-bold text-slate-900 truncate mt-1">
                {lowMarginProduct.sku}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Margin: <span className="font-bold text-rose-700">{lowMarginProduct.contributionMargin}%</span>
              </p>
              <p className="text-[10px] text-rose-600">
                Action: Fee recalibration needed
              </p>
            </div>
          )}
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">SKU & Product</th>
                <th className="py-2.5 px-3 text-right">Units</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Ad Spend</th>
                <th className="py-2.5 px-3 text-right">All Fees</th>
                <th className="py-2.5 px-3 text-right">Contribution Profit</th>
                <th className="py-2.5 px-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {brandProducts.map((p) => (
                <tr key={p.sku} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 block">{p.sku}</span>
                    <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                      {p.title}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    {p.unitsSold.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {currSym}{p.totalRevenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {currSym}{p.adSpend.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {currSym}{(p.referralFee + p.fulfillmentCost).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                    {currSym}{p.contributionProfit.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.contributionMargin >= 20
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.contributionMargin >= 10
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.contributionMargin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. CAMPAIGN PERFORMANCE AUDIT */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          Amazon Advertising Campaign Intelligence
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Campaign Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Spend</th>
                <th className="py-2.5 px-3 text-right">Ad Sales</th>
                <th className="py-2.5 px-3 text-right">ACOS</th>
                <th className="py-2.5 px-3 text-right">ROAS</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {brandCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs truncate">
                    {c.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">{c.type}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    {currSym}{c.spend.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {currSym}{c.adSales.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold">
                    <span
                      className={
                        c.acos <= brand.targetAcos ? 'text-emerald-700' : 'text-amber-700'
                      }
                    >
                      {c.acos}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {c.roas}x
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. QUALITATIVE AUDIT: IMPROVEMENTS, PROBLEMS, RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Major Improvements */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Major Improvements Accomplished</span>
          </div>
          <div className="space-y-2.5">
            {majorImprovements.map((imp) => (
              <div key={imp.id} className="bg-white p-3 rounded-lg border border-emerald-200/80 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-900 block">{imp.title}</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{imp.detail}</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                  {imp.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Problems Identified */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Performance Risks & Deviations</span>
          </div>
          <div className="space-y-2.5">
            {problemsIdentified.map((prob) => (
              <div key={prob.id} className="bg-white p-3 rounded-lg border border-rose-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{prob.title}</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                    {prob.metric}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{prob.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="p-5 rounded-xl bg-sky-50/60 border border-sky-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-950 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Strategic Optimization Playbook</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white p-3.5 rounded-lg border border-sky-200 shadow-xs space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-sky-700 uppercase block tracking-wider">
                  {rec.category}
                </span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {rec.title}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                  {rec.action}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded self-start mt-2">
                {rec.estimatedImpact}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. NEXT WEEK'S PRIORITIES */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          Next Week's Operational Action Plan
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Task & Scope</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Timeline</th>
                <th className="py-2.5 px-3">Target Deliverable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {nextWeekPriorities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.priority.includes('P1')
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {item.task}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">{item.owner}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">{item.timeline}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs">{item.deliverable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. DATA LIMITATIONS & METHODOLOGY NOTE */}
      <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
        <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
          Attribution Methodology & Data Scope Notes:
        </span>
        <ul className="list-disc list-inside space-y-0.5 text-slate-600 leading-relaxed">
          {dataLimitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      </div>

      {/* 10. SIGN-OFF & AGENCY FOOTER */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          <span className="font-bold text-slate-800">Harpy Growth Intelligence</span> • Confidential Enterprise Client Report
        </div>
        <div className="flex items-center gap-3">
          <span>Prepared for: <strong className="text-slate-800">{brand.name}</strong></span>
          <span>•</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}

export default ClientReportDocument;

