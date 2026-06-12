import { KpiCard } from '../shared/KpiCard'
import { fmtCurrency, fmtTokens, fmtPct } from '../shared/formatters'
import { PLATFORM_LABEL } from '../../engine/pricing'
import type { ScenarioResult } from '../../engine/types'

export function KpiCards({ result }: { result: ScenarioResult }) {
  const bob = result.results.bob
  if (!bob) return null

  const competitors = Object.entries(result.results).filter(([id]) => id !== 'bob')
  const maxEntry = competitors.reduce<[string, typeof bob | null]>(
    (best, [id, r]) => (r!.tco > (best[1]?.tco ?? 0) ? [id, r!] : best),
    ['', null]
  )
  const bestCompCert = Math.max(...competitors.map(([, r]) => r!.budgetCertaintyScore), 0)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        highlight
        label={`Bob ${result.config.horizonYears}-Year TCO`}
        value={fmtCurrency(bob.tco, true)}
        sub={`${fmtCurrency(bob.costPerUserMonth)}/user/month`}
      />
      <KpiCard
        label={`Savings vs ${maxEntry[1] ? PLATFORM_LABEL[maxEntry[0] as keyof typeof PLATFORM_LABEL] ?? maxEntry[0] : 'Competitor'}`}
        value={fmtCurrency(result.bobSavingsVsMax, true)}
        sub={`${fmtPct(result.bobSavingsPctVsMax)} less expensive`}
      />
      <KpiCard
        label="Break-even Usage"
        value={result.breakEvenTokensPerUserMonth ? fmtTokens(result.breakEvenTokensPerUserMonth) : 'Already wins'}
        sub="tokens/user/month where Bob is cheapest"
      />
      <KpiCard
        label="Budget Certainty"
        value={`${bob.budgetCertaintyScore}/100`}
        sub={`vs ${bestCompCert}/100 next competitor`}
      />
    </div>
  )
}
