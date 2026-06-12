import { DEFAULT_PRICE_ASSUMPTIONS, PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'

const CONFIDENCE_COLOR: Record<string, string> = {
  high: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-red-100 text-red-700',
}

const SOURCE_LABEL: Record<string, string> = {
  public_list: 'Public list price',
  derived_estimate: 'Derived estimate',
  custom_override: 'Custom override',
  seller_entered: 'Seller-entered',
}

export function Assumptions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Assumptions & Sources</h2>
        <p className="text-sm text-gray-500 mt-1">
          All pricing inputs used in this simulation — sources, effective dates, and confidence levels.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-amber-800 mb-1">Disclaimer</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Competitor pricing is based on publicly listed enterprise rates as of the effective dates shown. Enterprise
          contracts typically include custom discounts, volume tiers, and committed-spend credits not reflected here.
          All figures are illustrative — engage each vendor for a formal quote. IBM Bob pricing is sourced directly
          from IBM's official configurator (part numbers shown).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500">Platform</th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500">Component</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Unit Price</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Unit</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Source Type</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Effective Date</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Confidence</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Notes</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_PRICE_ASSUMPTIONS.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2 pr-4">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{
                      color: PLATFORM_COLOR[a.platformId],
                      backgroundColor: PLATFORM_COLOR[a.platformId] + '18',
                    }}
                  >
                    {PLATFORM_LABEL[a.platformId].replace(' Enterprise', '')}
                  </span>
                </td>
                <td className="py-2 pr-4 text-xs text-gray-700">{a.component}</td>
                <td className="text-right py-2 px-3 text-xs font-mono font-semibold text-gray-800">
                  ${a.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-3 text-xs text-gray-500">{a.unit}</td>
                <td className="py-2 px-3 text-xs text-gray-500">{SOURCE_LABEL[a.sourceType] ?? a.sourceType}</td>
                <td className="py-2 px-3 text-xs text-gray-500">{a.effectiveDate}</td>
                <td className="py-2 px-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${CONFIDENCE_COLOR[a.confidence]}`}>
                    {a.confidence}
                  </span>
                </td>
                <td className="py-2 px-3 text-xs text-gray-500 max-w-xs leading-relaxed">
                  {a.sourceUrl.startsWith('http') ? (
                    <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-ibm-blue underline">
                      Source
                    </a>
                  ) : (
                    <span className="font-mono text-gray-400">{a.sourceUrl}</span>
                  )}{' '}
                  — {a.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Bob Pricing Model Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
          <div>
            <p className="font-semibold text-gray-800 mb-1">RU Sizing Formula</p>
            <p><code className="bg-gray-100 px-1 rounded">RUs = ROUNDUP(UsageEstimate × Users / 500, 0)</code></p>
            <p className="mt-1">UsageEstimate is the tier-based daily usage proxy (e.g. 1,000 for Standard).</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Included Token Pool</p>
            <p><code className="bg-gray-100 px-1 rounded">RUs × 1,000 Bobcoins × 400,000 tokens/Bobcoin</code></p>
            <p className="mt-1">All developers share this pool — eliminates per-seat waste.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Overage Calculation</p>
            <p><code className="bg-gray-100 px-1 rounded">CEILING(extra_RUs / 1000) × $550</code></p>
            <p className="mt-1">Charged in 1,000-RU blocks. Right-sizing the pool eliminates overage entirely.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">Support</p>
            <p><code className="bg-gray-100 px-1 rounded">MAX($40,000, 15% × (SaaS base))</code></p>
            <p className="mt-1">Annual support minimum applies. Optional — toggle in Custom Mode.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
