import { fmtCurrency, fmtPct } from '../shared/formatters'
import { PLATFORM_LABEL } from '../../engine/pricing'
import type { ScenarioResult, PlatformId } from '../../engine/types'

export function ExecutiveNarrative({ result }: { result: ScenarioResult }) {
  const bob = result.results.bob
  if (!bob) return null

  const competitors = Object.entries(result.results).filter(([id]) => id !== 'bob')
  const maxEntry = competitors.reduce<[string, typeof bob | null]>(
    (best, [id, r]) => (r!.tco > (best[1]?.tco ?? 0) ? [id, r!] : best),
    ['', null]
  )
  const maxLabel = maxEntry[1] ? (PLATFORM_LABEL[maxEntry[0] as PlatformId] ?? maxEntry[0]) : 'any competitor'
  const savingsPct = result.bobSavingsPctVsMax

  const certDiff = bob.budgetCertaintyScore - Math.max(...competitors.map(([, r]) => r!.budgetCertaintyScore), 0)

  const horizon = result.config.horizonYears
  const users = result.config.users

  return (
    <div className="bg-ibm-blue/5 border border-ibm-blue/20 rounded-xl p-5">
      <h3 className="text-xs font-semibold text-ibm-blue uppercase tracking-wider mb-3">Executive Summary</h3>
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        <p>
          For <strong>{users.toLocaleString()} developers</strong> over {horizon} years, IBM Bob Enterprise delivers a
          total cost of <strong>{fmtCurrency(bob.tco, true)}</strong> —
          <strong className="text-ibm-blue"> {fmtPct(savingsPct)} less</strong> than {maxLabel},
          saving <strong>{fmtCurrency(result.bobSavingsVsMax, true)}</strong> in total AI investment.
        </p>
        <p>
          Bob's enterprise-grade token pooling model converts per-seat token caps into a shared organizational
          pool, eliminating waste from uneven developer usage and ensuring heavy users never throttle
          productivity — a structural cost advantage that widens as teams scale.
        </p>
        {certDiff > 0 && (
          <p>
            With a Budget Certainty Score of <strong>{bob.budgetCertaintyScore}/100</strong>{' '}
            ({certDiff} points ahead of the next competitor), Bob's predictable RU-based pricing
            removes token-cost volatility from financial planning, making it the only enterprise AI
            platform that can be committed-to at the start of a fiscal year.
          </p>
        )}
      </div>
    </div>
  )
}
