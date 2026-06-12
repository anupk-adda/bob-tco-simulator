import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'
import { fmtCurrency } from '../shared/formatters'
import type { ScenarioResult, PlatformId } from '../../engine/types'

export function AnnualCostChart({ result }: { result: ScenarioResult }) {
  const horizon = result.config.horizonYears

  const data = Array.from({ length: horizon }, (_, i) => {
    const row: Record<string, number | string> = { name: `Year ${i + 1}` }
    for (const [pid, r] of Object.entries(result.results)) {
      row[pid] = Math.round(r!.years[i]?.netCost ?? 0)
    }
    return row
  })

  const platforms = result.config.platforms

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Annual Cost by Platform</h3>
      <p className="text-xs text-gray-400 mb-4">Year-over-year cost with {(result.config.annualUsageGrowthPct * 100).toFixed(0)}% usage growth</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={2} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => fmtCurrency(v, true)} tick={{ fontSize: 11 }} width={62} />
          <Tooltip formatter={(v, name) => [fmtCurrency(v as number), PLATFORM_LABEL[name as PlatformId] ?? String(name)]} />
          <Legend formatter={(v) => PLATFORM_LABEL[v as PlatformId] ?? v} wrapperStyle={{ fontSize: 11 }} />
          {platforms.map((pid) => (
            <Bar key={pid} dataKey={pid} fill={PLATFORM_COLOR[pid]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
