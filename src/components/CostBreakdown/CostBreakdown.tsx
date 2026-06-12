import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { useActiveScenario } from '../../store/useSimulator'
import { computeScenarioResult } from '../../engine/calculator'
import { fmtCurrency, fmtTokens } from '../shared/formatters'
import { PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'
import type { PlatformId } from '../../engine/types'

export function CostBreakdown() {
  const activeScenario = useActiveScenario()
  const config = useMemo(() => activeScenario, [activeScenario])
  const result = useMemo(() => computeScenarioResult(config), [config])

  const horizon = config.horizonYears

  const waterfallData = config.platforms.map((pid) => {
    const r = result.results[pid]
    if (!r) return { name: PLATFORM_LABEL[pid], seat: 0, usage: 0, support: 0, overage: 0 }
    const totals = r.years.reduce(
      (acc, y) => {
        acc.seat += y.seatCost
        acc.usage += y.usageCost
        acc.support += y.supportCost
        acc.overage += y.overageCost
        return acc
      },
      { seat: 0, usage: 0, support: 0, overage: 0 }
    )
    return { name: PLATFORM_LABEL[pid].replace(' Enterprise', ''), ...totals, color: PLATFORM_COLOR[pid] }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Cost Breakdown</h2>
        <p className="text-sm text-gray-500 mt-1">
          {horizon}-year TCO decomposed by cost category across all platforms.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Stacked Cost Components ({horizon}-Year Total)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={waterfallData} layout="vertical" barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => fmtCurrency(v, true)} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={130} />
            <Tooltip
              formatter={(v, name) => [fmtCurrency(v as number), String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="seat" name="Seat / License" stackId="a" fill="#0F62FE" radius={[0, 0, 0, 0]} />
            <Bar dataKey="usage" name="Usage / Consumption" stackId="a" fill="#0F62FE99" />
            <Bar dataKey="support" name="Support" stackId="a" fill="#10B981" />
            <Bar dataKey="overage" name="Overage" stackId="a" fill="#EF4444" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Detailed Year-by-Year Breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500">Platform</th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500">Year</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Users</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Tokens</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Seats</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Usage</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-gray-500">Support</th>
              <th className="text-right py-2 px-2 text-xs font-semibold text-green-600">Net Cost</th>
            </tr>
          </thead>
          <tbody>
            {config.platforms.map((pid) => {
              const r = result.results[pid]
              if (!r) return null
              return r.years.map((y, i) => (
                <tr key={`${pid}-${i}`} className="border-b border-gray-50 hover:bg-gray-50/50">
                  {i === 0 && (
                    <td
                      rowSpan={horizon}
                      className={`py-2 pr-4 align-top font-medium ${pid === 'bob' ? 'text-ibm-blue' : 'text-gray-700'}`}
                      style={{ borderRight: `3px solid ${PLATFORM_COLOR[pid as PlatformId]}` }}
                    >
                      {PLATFORM_LABEL[pid]}
                    </td>
                  )}
                  <td className="py-2 px-2 text-gray-500">Year {y.year}</td>
                  <td className="text-right py-2 px-2">{y.users.toLocaleString()}</td>
                  <td className="text-right py-2 px-2 text-gray-500">{fmtTokens(y.annualTokens)}</td>
                  <td className="text-right py-2 px-2">{fmtCurrency(y.seatCost, true)}</td>
                  <td className="text-right py-2 px-2">{fmtCurrency(y.usageCost, true)}</td>
                  <td className="text-right py-2 px-2">{fmtCurrency(y.supportCost, true)}</td>
                  <td className={`text-right py-2 px-2 font-semibold ${pid === 'bob' ? 'text-ibm-blue' : ''}`}>
                    {fmtCurrency(y.netCost, true)}
                  </td>
                </tr>
              ))
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
