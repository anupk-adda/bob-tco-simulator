interface Service {
  id: string
  phase: string
  icon: string
  name: string
  tagline: string
  description: string
  highlights: string[]
  savingsRange?: string
}

const PHASE_COLOR: Record<string, string> = {
  Awareness:  '#0F62FE',
  Evaluation: '#0050E6',
  Deployment: '#10B981',
  Scale:      '#002CA6',
}

export function OptimizeAtScale({
  services,
  onBack,
}: {
  services: Service[]
  onBack: () => void
}) {
  return (
    <div className="space-y-8">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-ibm-blue transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Bob Acceleration Program
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-900">Optimize at Scale — All Services</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#001141] to-[#0F62FE] rounded-2xl p-8 flex items-center gap-8">
        <img src="/bob-logo.png" alt="Bob" className="w-24 h-auto hidden md:block drop-shadow-xl" />
        <div>
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">IBM Client Engineering</p>
          <h2 className="text-2xl font-bold text-white mb-2">Bob Acceleration Program — Full Service Catalogue</h2>
          <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
            Four structured services that guide every enterprise from initial awareness through to optimised, governed AI development at scale. Each service is designed to reduce risk, accelerate value, and produce evidence the business can act on.
          </p>
        </div>
      </div>

      {/* All services complimentary */}
      <div className="flex items-center gap-3 bg-ibm-blue/5 border border-ibm-blue/20 rounded-xl px-5 py-3">
        <svg className="w-5 h-5 text-ibm-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-ibm-blue font-medium">
          All four services are complimentary — included with every IBM Bob Enterprise license.
        </p>
      </div>

      {/* Services */}
      <div className="space-y-6">
        {services.map((s, i) => {
          const phaseColor = PHASE_COLOR[s.phase] ?? '#0F62FE'
          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Service header */}
              <div
                className="flex items-start gap-5 px-6 py-5 border-b border-gray-50"
                style={{ borderLeft: `5px solid ${phaseColor}` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: phaseColor + '18' }}
                >
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: phaseColor, backgroundColor: phaseColor + '18' }}
                    >
                      Step {i + 1} · {s.phase}
                    </span>
                    {s.savingsRange && (
                      <span className="text-xs text-gray-400">{s.savingsRange}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{s.name}</h3>
                  <p className="text-sm text-gray-500 italic mt-0.5">{s.tagline}</p>
                </div>
              </div>

              {/* Service body */}
              <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">What We Deliver</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Included</p>
                  <ul className="space-y-2">
                    {s.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: phaseColor }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CEPP banner — features only, no numbers */}
      <div className="bg-gray-900 rounded-2xl px-8 py-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5 text-center">
          Powered by CEPP — Client Engineering Premium Package
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            'Code Engine Pipeline Platform',
            'Modernisation Modes',
            'AI Skills & Commands',
            'MCP Integrations',
            'IBM Documentation Sources',
            'Rapid Time to Production',
          ].map((feature) => (
            <span
              key={feature}
              className="bg-white/8 border border-white/15 text-white/75 text-xs font-medium px-4 py-2 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Back CTA */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-ibm-blue transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Program Overview
        </button>
      </div>
    </div>
  )
}
