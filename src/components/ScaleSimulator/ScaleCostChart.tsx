import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { fmtCurrency } from '../shared/formatters'
import { PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'
import { calculateBobYear, calculateCompetitorYear } from '../../engine/calculator'
import type { ScenarioConfig, PlatformId } from '../../engine/types'

const USER_STEPS = [10, 25, 50, 100, 250, 500, 750, 1000, 2000, 5000]

export function ScaleCostChart({ config }: { config: ScenarioConfig }) {
  const competitors = config.platforms.filter(p => p !== 'bob') as Exclude<PlatformId, 'bob'>[]

  const data = USER_STEPS.map((u) => {
    const c: ScenarioConfig = { ...config, users: u }
    const row: Record<string, number | string> = { users: u }
    row.bob = Math.round(calculateBobYear(c, 0).netCost)
    for (const pid of competitors) {
      row[pid] = Math.round(calculateCompetitorYear(pid, c, 0, config.priceOverrides).netCost)
    }
    return row
  })

  // Find crossover point where Bob becomes cheapest
  const crossoverUsers = data.find((d) =>
    competitors.every(pid => (d[pid] as number) > (d.bob as number))
  )?.users ?? null

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-700">Cost at Scale</h3>
        {crossoverUsers && (
          <span className="text-xs bg-ibm-blue/10 text-ibm-blue px-2 py-0.5 rounded-full font-medium">
            Bob leads from {crossoverUsers.toLocaleString()}+ users
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-4">Annual cost as developer headcount grows · Year 1 pricing</p>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="bobGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#0F62FE" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#0F62FE" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="users"
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : String(v)}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            label={{ value: 'Developers', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#9CA3AF' }}
          />
          <YAxis
            tickFormatter={(v) => fmtCurrency(v, true)}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={68}
          />
          <Tooltip
            formatter={(v, name) => [fmtCurrency(v as number), PLATFORM_LABEL[name as PlatformId] ?? String(name)]}
            labelFormatter={(l) => `${Number(l).toLocaleString()} developers`}
            contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
          />
          <Legend
            formatter={(v) => PLATFORM_LABEL[v as PlatformId] ?? v}
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
          />

          {crossoverUsers && (
            <ReferenceLine
              x={crossoverUsers}
              stroke="#0F62FE"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: 'Bob advantage →', position: 'top', fontSize: 10, fill: '#0F62FE' }}
            />
          )}

          {/* Competitors as plain lines — rendered first so Bob area appears on top */}
          {competitors.map((pid) => (
            <Line
              key={pid}
              type="monotone"
              dataKey={pid}
              stroke={PLATFORM_COLOR[pid]}
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}

          {/* Bob as prominent filled area — rendered last to stay on top */}
          <Area
            type="monotone"
            dataKey="bob"
            stroke="#0F62FE"
            strokeWidth={3}
            fill="url(#bobGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#0F62FE' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
