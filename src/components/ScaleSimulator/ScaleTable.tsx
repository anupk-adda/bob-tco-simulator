import { fmtCurrency } from '../shared/formatters'
import { PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'
import { calculateBobYear, calculateCompetitorYear } from '../../engine/calculator'
import type { ScenarioConfig, PlatformId } from '../../engine/types'

const USER_STEPS = [50, 100, 250, 500, 1000, 2000, 5000]

export function ScaleTable({ config }: { config: ScenarioConfig }) {
  const platforms = config.platforms

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Annual Cost Comparison by Team Size</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500">Developers</th>
            {platforms.map((pid) => (
              <th
                key={pid}
                className="text-right py-2 px-3 text-xs font-semibold"
                style={{ color: PLATFORM_COLOR[pid] }}
              >
                {PLATFORM_LABEL[pid]}
              </th>
            ))}
            <th className="text-right py-2 pl-3 text-xs font-semibold text-green-600">Bob Saves vs Max</th>
          </tr>
        </thead>
        <tbody>
          {USER_STEPS.map((u) => {
            const c: ScenarioConfig = { ...config, users: u }
            const costs: Record<string, number> = {}
            costs.bob = calculateBobYear(c, 0).netCost
            for (const pid of platforms.filter(p => p !== 'bob')) {
              costs[pid] = calculateCompetitorYear(pid as Exclude<PlatformId, 'bob'>, c, 0, config.priceOverrides).netCost
            }
            const maxComp = Math.max(...Object.entries(costs).filter(([id]) => id !== 'bob').map(([, v]) => v))
            const saves = maxComp - costs.bob

            return (
              <tr key={u} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2 pr-4 font-medium text-gray-700">{u.toLocaleString()}</td>
                {platforms.map((pid) => (
                  <td
                    key={pid}
                    className={`text-right py-2 px-3 ${pid === 'bob' ? 'font-semibold text-ibm-blue' : 'text-gray-600'}`}
                  >
                    {fmtCurrency(costs[pid], true)}
                  </td>
                ))}
                <td className="text-right py-2 pl-3 font-medium text-green-600">
                  {saves > 0 ? fmtCurrency(saves, true) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
