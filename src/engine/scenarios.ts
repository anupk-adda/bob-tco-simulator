import type { ScenarioConfig } from './types'

// 100-user high-consumption SDLC baseline: 80B tokens/year
// (20×10M + 40×40M + 30×100M + 10×186.667M) / 100 = 66.667M tokens/user/month × 100 × 12 = 80B
const DEFAULT_WORKLOAD_MIX = {
  occasional: { sharePct: 20, tokensPerMonth: 10_000_000 },    // light users
  active:     { sharePct: 40, tokensPerMonth: 40_000_000 },    // active developers
  power:      { sharePct: 30, tokensPerMonth: 100_000_000 },   // power developers
  agentic:    { sharePct: 10, tokensPerMonth: 186_666_666 },   // agentic/modernization (≤186.667M keeps 100 users at ≤80B/year)
}

const ALL_PLATFORMS = ['bob', 'github_copilot', 'claude_enterprise', 'gemini_code_assist'] as const

export const DEFAULT_SCENARIO: ScenarioConfig = {
  id: 'pilot',
  name: '100-User Pilot',
  users: 100,
  usageTier: 'standard',
  horizonYears: 3,
  annualUserGrowthPct: 0,
  annualUsageGrowthPct: 0.20,
  bobDiscountPct: 0,
  supportEnabled: false,
  premiumPackageJavaUsers: 0,
  workloadMix: DEFAULT_WORKLOAD_MIX,
  acceleratorEfficiencyGain: 0.15,
  platforms: [...ALL_PLATFORMS],
  priceOverrides: {},
}

export const PRESET_SCENARIOS: ScenarioConfig[] = [
  DEFAULT_SCENARIO,
  {
    ...DEFAULT_SCENARIO,
    id: 'rollout',
    name: '500-User Rollout',
    users: 500,
    usageTier: 'heavy',
  },
  {
    ...DEFAULT_SCENARIO,
    id: 'enterprise',
    name: '1000-User Enterprise Scale',
    users: 1_000,
  },
  {
    ...DEFAULT_SCENARIO,
    id: 'regulated_bank',
    name: 'Regulated Bank (2000 Users)',
    users: 2_000,
    supportEnabled: true,
  },
  {
    ...DEFAULT_SCENARIO,
    id: 'java_modernisation',
    name: 'Java Modernisation',
    users: 200,
    premiumPackageJavaUsers: 200,
  },
]
