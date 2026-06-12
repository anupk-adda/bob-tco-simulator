import { useMemo } from 'react'
import { useSimulator, useActiveScenario } from '../../store/useSimulator'
import { computeScenarioResult } from '../../engine/calculator'
import { computeAccelerator } from '../../engine/accelerator'
import { fmtCurrency, fmtPct } from '../shared/formatters'
import { DEFAULT_ACCELERATOR_COMPONENTS } from '../../engine/pricing'

export function AcceleratorROI() {
  const { setAcceleratorGain } = useSimulator()
  const activeScenario = useActiveScenario()
  const config = useMemo(() => activeScenario, [activeScenario])
  const result = useMemo(() => computeScenarioResult(config), [config])
  const accelerator = useMemo(() => computeAccelerator(result), [result])

  const gain = activeScenario.acceleratorEfficiencyGain
  const gainPct = Math.round(gain * 100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Bob Accelerator ROI</h2>
        <p className="text-sm text-gray-500 mt-1">
          Quantify the financial impact of the Bob Cost Optimization & Governance Service on your {config.horizonYears}-year TCO.
        </p>
      </div>

      {/* Savings slider */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Cost Optimisation & Governance Efficiency Gain</h3>
            <p className="text-xs text-gray-400">
              Conservative 8% · Expected 15% · Aggressive 25% — based on IBM Client Engineering customer data
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-ibm-blue">{gainPct}%</span>
            <p className="text-xs text-gray-400 mt-0.5">applied efficiency gain</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-gray-400 w-8">8%</span>
          <div className="flex-1 relative">
            <input
              type="range" min={8} max={25} step={1}
              value={gainPct}
              className="w-full accent-ibm-blue h-2"
              onChange={(e) => setAcceleratorGain(parseInt(e.target.value) / 100)}
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1 px-0">
              <span>Conservative</span>
              <span>Expected</span>
              <span>Aggressive</span>
            </div>
          </div>
          <span className="text-xs text-gray-400 w-8 text-right">25%</span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Bob Base TCO ({config.horizonYears}yr)</p>
            <p className="text-2xl font-bold text-gray-800">{fmtCurrency(accelerator.bobBaseTco, true)}</p>
          </div>
          <div className="border border-green-200 bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Governance Savings</p>
            <p className="text-2xl font-bold text-green-600">{fmtCurrency(accelerator.efficiencySavings, true)}</p>
            <p className="text-xs text-gray-400">{fmtPct(gain)} of Bob TCO</p>
          </div>
          <div className="bg-ibm-blue rounded-xl p-4 text-center">
            <p className="text-xs text-white/60 mb-1">Bob with Governance</p>
            <p className="text-2xl font-bold text-white">{fmtCurrency(accelerator.bobAcceleratorTco, true)}</p>
            <p className="text-xs text-white/60">vs {fmtCurrency(accelerator.maxCompetitorTco, true)} best competitor</p>
          </div>
        </div>

        {accelerator.totalValueVsMax > 0 && (
          <div className="mt-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-800">
              Total {config.horizonYears}-year advantage over most expensive competitor:{' '}
              <strong>{fmtCurrency(accelerator.totalValueVsMax, true)}</strong>
            </p>
          </div>
        )}
      </div>

      {/* 4 savings drivers */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">What drives the savings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_ACCELERATOR_COMPONENTS.map((c) => {
            const impact = accelerator.bobBaseTco * c.savingsPct
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{c.title}</h4>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-ibm-blue">{(c.savingsPct * 100).toFixed(0)}%</span>
                    <p className="text-xs text-gray-400">{fmtCurrency(impact, true)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">{c.description}</p>
                <p className="text-xs text-ibm-blue/80 italic">{c.savingsDriver}</p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ibm-blue rounded-full"
                    style={{ width: `${(c.savingsPct / 0.15) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
