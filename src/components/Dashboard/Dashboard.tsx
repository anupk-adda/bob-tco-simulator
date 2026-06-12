import { useMemo } from 'react'
import { useSimulator, useActiveScenario } from '../../store/useSimulator'
import { computeScenarioResult } from '../../engine/calculator'
import { DEFAULT_PRICE_ASSUMPTIONS } from '../../engine/pricing'
import { KpiCards } from './KpiCards'
import { AnnualCostChart } from './AnnualCostChart'
import { CostEscalationChart } from './CostEscalationChart'
import { ExecutiveNarrative } from './ExecutiveNarrative'

export function Dashboard() {
  const { customMode } = useSimulator()
  const activeScenario = useActiveScenario()
  const { updateScenario, setPriceOverride } = useSimulator()

  const config = useMemo(() => activeScenario, [activeScenario])
  const result = useMemo(() => computeScenarioResult(config), [config])

  return (
    <div className="space-y-6">
      {customMode && (
        <div className="bg-white border border-amber-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Custom Mode — Price Overrides</p>
          <p className="text-xs text-gray-400 mb-4">Edit any value — charts update immediately</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DEFAULT_PRICE_ASSUMPTIONS.map((a) => (
              <label key={`${activeScenario.id}-${a.id}`} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-600">{a.component}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className="border border-gray-200 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-ibm-blue focus:border-ibm-blue"
                    defaultValue={activeScenario.priceOverrides[a.id] ?? a.unitPrice}
                    key={`${activeScenario.id}-${a.id}-${activeScenario.priceOverrides[a.id] ?? a.unitPrice}`}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value)
                      if (!isNaN(v) && v >= 0) setPriceOverride(a.id, v)
                    }}
                  />
                  <span className="text-xs text-gray-300 whitespace-nowrap truncate max-w-20" title={a.unit}>{a.unit}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <KpiCards result={result} />

      <ExecutiveNarrative result={result} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnualCostChart result={result} />
        <CostEscalationChart config={config} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Scenario: {activeScenario.name}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Developers</p>
            {customMode ? (
              <input
                type="number"
                className="border border-gray-200 rounded px-2 py-1 text-sm w-28 mt-1 focus:outline-none focus:ring-1 focus:ring-ibm-blue"
                value={activeScenario.users}
                onChange={(e) => {
                  const v = parseInt(e.target.value)
                  if (!isNaN(v) && v > 0) updateScenario({ users: v })
                }}
              />
            ) : (
              <p className="font-semibold text-gray-800">{activeScenario.users.toLocaleString()}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400">Usage Tier</p>
            {customMode ? (
              <select
                className="border border-gray-200 rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-ibm-blue"
                value={activeScenario.usageTier}
                onChange={(e) => updateScenario({ usageTier: e.target.value as typeof activeScenario.usageTier })}
              >
                <option value="light">Light — 25M tok/user/mo</option>
                <option value="standard">Standard — 75M tok/user/mo</option>
                <option value="heavy">Heavy — 200M tok/user/mo</option>
                <option value="agentic">Agentic — 500M tok/user/mo</option>
                <option value="factory">Factory — 1B tok/user/mo</option>
              </select>
            ) : (
              <p className="font-semibold text-gray-800 capitalize">{activeScenario.usageTier}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400">Annual Usage Growth</p>
            {customMode ? (
              <input
                type="number"
                min={0} max={100} step={5}
                className="border border-gray-200 rounded px-2 py-1 text-sm w-20 mt-1 focus:outline-none focus:ring-1 focus:ring-ibm-blue"
                value={Math.round(activeScenario.annualUsageGrowthPct * 100)}
                onChange={(e) => {
                  const v = parseInt(e.target.value)
                  if (!isNaN(v) && v >= 0) updateScenario({ annualUsageGrowthPct: v / 100 })
                }}
              />
            ) : (
              <p className="font-semibold text-gray-800">{(activeScenario.annualUsageGrowthPct * 100).toFixed(0)}%</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400">Horizon</p>
            <p className="font-semibold text-gray-800">{activeScenario.horizonYears} years</p>
          </div>
        </div>
      </div>
    </div>
  )
}
