import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceArea, ResponsiveContainer,
} from 'recharts'
import { fmtCurrency, fmtTokens } from '../shared/formatters'
import { PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'
import { calculateBobYear, calculateCompetitorYear } from '../../engine/calculator'
import type { ScenarioConfig, PlatformId } from '../../engine/types'

const TOKEN_STEPS = [25, 50, 75, 100, 150, 200, 300, 500, 750, 1000].map(v => v * 1_000_000)

export function CostEscalationChart({ config }: { config: ScenarioConfig }) {
  const data = TOKEN_STEPS.map((t) => {
    const testConfig: ScenarioConfig = {
      ...config,
      workloadMix: {
        occasional: { sharePct: 25, tokensPerMonth: t },
        active:     { sharePct: 25, tokensPerMonth: t },
        power:      { sharePct: 25, tokensPerMonth: t },
        agentic:    { sharePct: 25, tokensPerMonth: t },
      },
    }
    const row: Record<string, number | string> = {
      tokens: t,
      label: fmtTokens(t),
    }
    row.bob = calculateBobYear(testConfig, 0).netCost
    for (const pid of config.platforms.filter(p => p !== 'bob')) {
      row[pid] = calculateCompetitorYear(pid as Exclude<PlatformId, 'bob'>, testConfig, 0, config.priceOverrides).netCost
    }
    return row
  })

  const breakIdx = data.findIndex((d) =>
    config.platforms.filter(p => p !== 'bob').every(
      pid => (d[pid] as number) >= (d.bob as number)
    )
  )

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Cost vs Token Usage</h3>
      <p className="text-xs text-gray-400 mb-4">Annual cost as tokens/user/month increases — shaded = Bob advantage zone</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tickFormatter={(v) => fmtCurrency(v, true)} tick={{ fontSize: 11 }} width={62} />
          <Tooltip
            formatter={(v, name) => [fmtCurrency(v as number), PLATFORM_LABEL[name as PlatformId] ?? String(name)]}
            labelFormatter={(l) => `${l} tokens/user/month`}
          />
          <Legend formatter={(v) => PLATFORM_LABEL[v as PlatformId] ?? v} wrapperStyle={{ fontSize: 11 }} />
          {breakIdx >= 0 && (
            <ReferenceArea
              x1={data[breakIdx]?.label as string}
              fill="#0F62FE"
              fillOpacity={0.06}
            />
          )}
          {config.platforms.map((pid) => (
            <Line
              key={pid}
              dataKey={pid}
              stroke={PLATFORM_COLOR[pid]}
              strokeWidth={pid === 'bob' ? 3 : 1.5}
              dot={false}
              strokeDasharray={pid === 'bob' ? undefined : '5 3'}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
