import { useState } from 'react'
import { OptimizeAtScale } from './OptimizeAtScale'

const LIFECYCLE = [
  {
    phase: 'Awareness',
    service: 'Bobathon',
    icon: '🎯',
    blurb: 'See Bob work on your own codebase — live, tailored, same-day value.',
    color: '#0F62FE',
  },
  {
    phase: 'Evaluation',
    service: 'SDLC Pilot',
    icon: '🔬',
    blurb: 'A structured 2–3 week proof-of-value with measurable developer velocity uplift.',
    color: '#0050E6',
  },
  {
    phase: 'Deployment',
    service: 'Deployment Accelerator',
    icon: '🚀',
    blurb: 'Proven CEPP artifacts delivered as-is — reference architectures, templates, playbooks.',
    color: '#003EC6',
  },
  {
    phase: 'Scale',
    service: 'Optimize at Scale',
    icon: '📊',
    blurb: 'Customised cost governance, optimisation advisory, and best practices for your environment.',
    color: '#002CA6',
  },
]

const SERVICES = [
  {
    id: 'bobathon',
    phase: 'Awareness',
    icon: '🎯',
    name: 'Account-Specific Bobathon',
    tagline: 'Your code. Your team. Real IBM Bob capabilities — in one session.',
    description:
      'A tailored workshop where your developers experience Bob directly against your own enterprise SDLC patterns. IBM Client Engineering leads the session live, covering the full breadth of Bob\'s AI skills across your actual repos and toolchain.',
    highlights: [
      'Customised to your SDLC patterns and toolchain',
      'AI skills across code generation, testing, documentation, refactoring, and review',
      'MCP integrations: Jira, Confluence, GitHub, GitLab, ServiceNow',
      'IBM documentation sources pre-wired',
      'Same-day developer NPS and feedback loop',
    ],
  },
  {
    id: 'pilot',
    phase: 'Evaluation',
    icon: '🔬',
    name: 'Bob Pre-sales SDLC Pilot',
    tagline: 'Quantified ROI before you sign a contract.',
    description:
      'A 2–3 week structured pilot that embeds Bob into your live development workflows. IBM Client Engineering instruments measurement, runs the deployment, and produces a data-backed business case — PR throughput, cycle time, test coverage, developer adoption — ready for your CIO and finance team.',
    highlights: [
      '2–3 weeks from kickoff to executive-ready evidence',
      'Real CEPP pipeline integration — not a demo environment',
      'Velocity measurement: PR throughput, review cycle time, coverage delta',
      'Developer adoption scorecard and NPS tracking',
      'IBM-authored ROI narrative for finance approval',
    ],
  },
  {
    id: 'deployment',
    phase: 'Deployment',
    icon: '🚀',
    name: 'Bob Deployment Accelerator',
    tagline: 'IBM\'s proven CEPP artifacts — delivered as-is for your enterprise.',
    description:
      'IBM Client Engineering delivers the full CEPP deployment toolkit directly to your organisation. These are IBM\'s standard, battle-tested artifacts — reference architectures, configuration templates, IDE extension packages, integration playbooks — shipped as-is. You get what IBM uses internally for enterprise Bob deployments, not a bespoke engagement. This maximises deployment speed and keeps you aligned with IBM\'s supported configurations.',
    highlights: [
      'IBM standard reference architecture for Bob enterprise deployment',
      'CEPP configuration templates and automation scripts (as-is)',
      'IDE extension deployment packages for VS Code, IntelliJ, and Eclipse',
      'SSO / OIDC and enterprise proxy integration playbooks',
      'Onboarding and admin training materials from the IBM library',
    ],
  },
  {
    id: 'optimize',
    phase: 'Scale',
    icon: '📊',
    name: 'Bob Cost Optimization & Governance Service',
    tagline: 'Customised to your organisation — not a generic governance framework.',
    description:
      'Unlike the Deployment Accelerator, this service is fully customised to your specific Bob environment. IBM Client Engineering analyses your actual Bobcoin consumption patterns, team-by-team usage data, and real SDLC workflows to build a governance model and optimisation roadmap tailored to your organisation. Every recommendation is derived from your data, not a template. Customers running this service see 8–25% TCO reduction.',
    highlights: [
      'Cost Governance — burn-rate forecasting and threshold alerts calibrated to your teams',
      'Optimisation Advisory — custom RU right-sizing based on your actual consumption patterns',
      'Best Practices — IBM-proven AI adoption frameworks adapted to your SDLC and toolchain',
    ],
    savingsRange: '8% – 25% TCO reduction',
  },
]

const CEPP_FEATURES = [
  'Code Engine Pipeline Platform',
  'Modernisation Modes',
  'AI Skills & Commands',
  'MCP Integrations',
  'IBM Documentation Sources',
  'Rapid Time to Production',
]

export function BobAccelerationProgram() {
  const [view, setView] = useState<'overview' | 'optimize'>('overview')

  if (view === 'optimize') {
    return <OptimizeAtScale services={SERVICES} onBack={() => setView('overview')} />
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#001141] to-ibm-blue rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 800 400">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative px-8 py-10 md:px-12 flex items-center gap-8 flex-wrap md:flex-nowrap">
          <div className="flex-shrink-0">
            <img src="/bob-logo.png" alt="IBM Bob" className="w-44 h-auto drop-shadow-2xl" />
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-wide">IBM Client Engineering</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Bob Acceleration Program
            </h1>
            <p className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed">
              Four IBM Client Engineering services that take you from first demo to enterprise-scale AI development — de-risked, measured, and continuously optimised. All services included with your IBM Bob Enterprise license.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setView('optimize')}
                className="inline-flex items-center gap-2 bg-white text-ibm-blue px-5 py-2.5 rounded-lg text-sm font-semibold shadow hover:shadow-md transition-shadow"
              >
                Explore Services in Detail
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-shrink-0 grid grid-cols-2 gap-3 text-center">
            {[
              { v: '2–3 wks', l: 'to production' },
              { v: '8–25%', l: 'TCO savings' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 border border-white/15 rounded-xl px-5 py-4">
                <p className="text-2xl font-bold text-white">{s.v}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All services complimentary banner */}
      <div className="flex items-center gap-3 bg-ibm-blue/5 border border-ibm-blue/20 rounded-xl px-5 py-3">
        <svg className="w-5 h-5 text-ibm-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-ibm-blue font-medium">
          All four services are complimentary — included with every IBM Bob Enterprise license.
        </p>
      </div>

      {/* Lifecycle journey */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Journey</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LIFECYCLE.map((s, i) => (
            <div
              key={s.phase}
              className="relative rounded-xl p-4 border border-gray-100 bg-white hover:border-ibm-blue/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ color: s.color, backgroundColor: s.color + '18' }}
                >
                  {s.phase}
                </span>
                <span className="text-base">{s.icon}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1.5">{s.service}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{s.blurb}</p>
              {i < LIFECYCLE.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key distinction callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🚀</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">As-is delivery</p>
              <p className="text-sm font-semibold text-gray-900">Deployment Accelerator</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            IBM's proven CEPP artifacts — reference architectures, templates, and playbooks — delivered as-is from IBM's enterprise deployment library. Consistent, fast, fully supported.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-xs font-bold text-ibm-blue uppercase tracking-wider">Customised to you</p>
              <p className="text-sm font-semibold text-gray-900">Cost Optimization & Governance</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Built entirely from your organisation's actual Bobcoin consumption data, team usage patterns, and SDLC workflows. Every recommendation is specific to your environment.
          </p>
        </div>
      </div>

      {/* Optimize at Scale CTA */}
      <div className="relative bg-gradient-to-r from-ibm-blue to-[#0050E6] rounded-2xl p-8 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-8 opacity-10">
          <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
          </svg>
        </div>
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Optimize at Scale</p>
            <h3 className="text-2xl font-bold text-white mb-2">
              Bob Cost Optimization & Governance
            </h3>
            <p className="text-white/75 text-sm max-w-lg leading-relaxed">
              Once Bob is deployed, IBM Client Engineering builds a customised governance model from your actual usage data — driving 8–25% TCO reduction through targeted cost governance, optimisation advisory, and best practices tailored to your SDLC.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView('optimize')}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-ibm-blue px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Explore All Services
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* CEPP strip */}
      <div className="bg-gray-900 rounded-2xl px-8 py-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5 text-center">
          Powered by CEPP — Client Engineering Premium Package
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {CEPP_FEATURES.map((feature) => (
            <span
              key={feature}
              className="bg-white/8 border border-white/15 text-white/75 text-xs font-medium px-4 py-2 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
