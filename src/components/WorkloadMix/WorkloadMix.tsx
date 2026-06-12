import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useSimulator, useActiveScenario } from '../../store/useSimulator'
import { computeScenarioResult } from '../../engine/calculator'
import { fmtTokens, fmtCurrency } from '../shared/formatters'
import { PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'
import type { PersonaMix, PlatformId } from '../../engine/types'

const PERSONA_COLORS = ['#0F62FE', '#0F62FE99', '#0F62FE66', '#0F62FE33']
const PERSONA_LABELS: Record<keyof PersonaMix, string> = {
  occasional: 'Occasional',
  active: 'Active',
  power: 'Power',
  agentic: 'Agentic',
}

export function WorkloadMix() {
  const activeScenario = useActiveScenario()
  const { updateScenario } = useSimulator()
  // Force 3-year horizon for the impact chart regardless of scenario setting
  const config3yr = useMemo(
    () => ({ ...activeScenario, horizonYears: 3 as const }),
    [activeScenario]
  )
  const result = useMemo(() => computeScenarioResult(config3yr), [config3yr])
  const mix = activeScenario.workloadMix

  const pieData = (Object.keys(mix) as (keyof PersonaMix)[]).map((k, i) => ({
    name: PERSONA_LABELS[k],
    value: mix[k].sharePct,
    color: PERSONA_COLORS[i],
    tokens: mix[k].tokensPerMonth,
  }))

  const totalShare = Object.values(mix).reduce((s, m) => s + m.sharePct, 0)

  // 3-year grouped bar data: one row per year
  const barData = [1, 2, 3].map((yr) => {
    const row: Record<string, string | number> = { year: `Year ${yr}` }
    for (const pid of config3yr.platforms) {
      const r = result.results[pid]
      if (r) row[pid] = Math.round(r.years[yr - 1]?.netCost ?? 0)
    }
    return row
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Workload Mix</h2>
        <p className="text-sm text-gray-500 mt-1">
          Adjust developer persona distribution — the mix flows into annual token calculations for all platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700">Persona Sliders</h3>
          {(Object.keys(mix) as (keyof PersonaMix)[]).map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{PERSONA_LABELS[key]}</span>
                <span className="text-xs text-gray-400">{mix[key].sharePct}% · {fmtTokens(mix[key].tokensPerMonth)}/month</span>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="range" min={0} max={100} step={5}
                  value={mix[key].sharePct}
                  className="flex-1 accent-ibm-blue"
                  onChange={(e) => {
                    const v = parseInt(e.target.value)
                    updateScenario({ workloadMix: { ...mix, [key]: { ...mix[key], sharePct: v } } })
                  }}
                />
                <input
                  type="number"
                  className="border border-gray-200 rounded px-2 py-1 text-xs w-28"
                  value={mix[key].tokensPerMonth}
                  onChange={(e) => {
                    const v = parseInt(e.target.value)
                    if (!isNaN(v) && v >= 0)
                      updateScenario({ workloadMix: { ...mix, [key]: { ...mix[key], tokensPerMonth: v } } })
                  }}
                />
              </div>
            </div>
          ))}
          {totalShare !== 100 && (
            <p className="text-xs text-amber-600 font-medium">
              Persona shares sum to {totalShare}% — adjust sliders to total 100%
            </p>
          )}
        </div>

        {/* Donut */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend formatter={(v) => v} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3-year impact chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Workload Impact — 3-Year Platform Costs</h3>
        <p className="text-xs text-gray-400 mb-4">
          Annual cost per platform at current persona mix with {(activeScenario.annualUsageGrowthPct * 100).toFixed(0)}% usage growth
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} barGap={2} barCategoryGap="22%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => fmtCurrency(v, true)} tick={{ fontSize: 11 }} width={64} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v, name) => [fmtCurrency(v as number), PLATFORM_LABEL[name as PlatformId] ?? String(name)]}
              contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
            />
            <Legend
              formatter={(v) => PLATFORM_LABEL[v as PlatformId] ?? v}
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
            />
            {config3yr.platforms.map((pid) => (
              <Bar key={pid} dataKey={pid} fill={PLATFORM_COLOR[pid]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Year-by-year table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Year-by-Year Cost at Current Mix</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500">Platform</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Year 1</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Year 2</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Year 3</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">3-Yr TCO</th>
            </tr>
          </thead>
          <tbody>
            {config3yr.platforms.map((pid) => {
              const r = result.results[pid]
              if (!r) return null
              return (
                <tr key={pid} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className={`py-2 pr-4 font-medium ${pid === 'bob' ? 'text-ibm-blue' : 'text-gray-700'}`}>
                    {PLATFORM_LABEL[pid]}
                  </td>
                  {r.years.map((y, i) => (
                    <td key={i} className="text-right py-2 px-3">{fmtCurrency(y.netCost, true)}</td>
                  ))}
                  <td className="text-right py-2 px-3 font-semibold">{fmtCurrency(r.tco, true)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
