import { describe, it, expect } from 'vitest'
import { calculateBobYear, calculateCompetitorYear, computeScenarioResult } from './calculator'
import { DEFAULT_SCENARIO } from './scenarios'

describe('calculateBobYear', () => {
  it('matches spec baseline: 100 users, standard, no support, no discount', () => {
    const result = calculateBobYear(DEFAULT_SCENARIO, 0)
    // seat: 100 × 20 × 12 = 24,000
    // RUs: CEIL(1000 × 100 / 500) = 200; pooled: 200 × 500.04 = 100,008
    // workload mix: (20×10M + 40×40M + 30×100M + 10×186.667M)/100 = 66.667M tok/user/mo
    // annual: 66.667M × 100 × 12 = 80B = exactly included pool → no overage
    expect(result.seatCost).toBe(24_000)
    expect(result.usageCost).toBeCloseTo(100_008, 0)
    expect(result.overageCost).toBe(0)
    expect(result.netCost).toBeCloseTo(124_008, 0)
  })

  it('applies 5% discount correctly', () => {
    const config = { ...DEFAULT_SCENARIO, bobDiscountPct: 0.05 }
    const result = calculateBobYear(config, 0)
    const expectedGross = result.seatCost + result.usageCost + result.overageCost
    expect(result.discountAmount).toBeCloseTo(expectedGross * 0.05, 0)
    expect(result.netCost).toBeCloseTo(expectedGross * 0.95, 0)
  })

  it('applies support: max(40000, 15% of saas base)', () => {
    const config = { ...DEFAULT_SCENARIO, supportEnabled: true }
    const result = calculateBobYear(config, 0)
    // 15% of saasBase (124,008) = 18,601 < 40,000 min
    expect(result.supportCost).toBe(40_000)
    expect(result.netCost).toBeCloseTo(result.seatCost + result.usageCost + result.overageCost + 40_000, 0)
  })

  it('support exceeds minimum for large deployments', () => {
    const config = { ...DEFAULT_SCENARIO, users: 2000, supportEnabled: true }
    const result = calculateBobYear(config, 0)
    expect(result.supportCost).toBeGreaterThan(40_000)
  })

  it('grows users with annualUserGrowthPct at year 2', () => {
    const config = { ...DEFAULT_SCENARIO, annualUserGrowthPct: 0.10 }
    const y0 = calculateBobYear(config, 0)
    const y1 = calculateBobYear(config, 1)
    expect(y1.users).toBe(110)
    expect(y1.netCost).toBeGreaterThan(y0.netCost)
  })

  it('calculates overage when agentic usage exceeds pool', () => {
    const config = {
      ...DEFAULT_SCENARIO,
      usageTier: 'agentic' as const,
      users: 100,
      workloadMix: {
        occasional: { sharePct: 0, tokensPerMonth: 0 },
        active: { sharePct: 0, tokensPerMonth: 0 },
        power: { sharePct: 0, tokensPerMonth: 0 },
        agentic: { sharePct: 100, tokensPerMonth: 2_000_000_000 }, // 2B tokens/user/month — well above pool
      },
    }
    const result = calculateBobYear(config, 0)
    expect(result.overageCost).toBeGreaterThan(0)
  })
})

describe('calculateCompetitorYear', () => {
  it('github copilot: seat + token-metered model = $434,000 for 100 users at 80B tokens', () => {
    const result = calculateCompetitorYear('github_copilot', DEFAULT_SCENARIO, 0, {})
    // seatCost = 39 × 100 × 12 = 46,800 (also included credit value)
    // grossTokenCost = (56,000M × 1.75) + (24,000M × 14.0) = 98,000 + 336,000 = 434,000
    // usageCost = MAX(0, 434,000 - 46,800) = 387,200
    // netCost = 46,800 + 387,200 = 434,000
    expect(result.seatCost).toBe(46_800)
    expect(result.usageCost).toBeCloseTo(387_200, 0)
    expect(result.netCost).toBeCloseTo(434_000, 0)
  })

  it('claude enterprise: token-only model = $528,000 for 100 users at 80B tokens', () => {
    const result = calculateCompetitorYear('claude_enterprise', DEFAULT_SCENARIO, 0, {})
    // grossTokenCost = (56,000M × 3.0) + (24,000M × 15.0) = 168,000 + 360,000 = 528,000
    expect(result.seatCost).toBe(0)
    expect(result.netCost).toBeCloseTo(528_000, 0)
  })

  it('gemini code assist: seat + token-equivalent = $364,000 for 100 users at 80B tokens', () => {
    const result = calculateCompetitorYear('gemini_code_assist', DEFAULT_SCENARIO, 0, {})
    // seatCost = 45 × 100 × 12 = 54,000
    // grossTokenCost = (56,000M × 1.25) + (24,000M × 10.0) = 70,000 + 240,000 = 310,000
    // netCost = 54,000 + 310,000 = 364,000
    expect(result.seatCost).toBe(54_000)
    expect(result.netCost).toBeCloseTo(364_000, 0)
  })

  it('price overrides are applied', () => {
    // Double Claude input rate — pure token model so effect is direct
    const result = calculateCompetitorYear('claude_enterprise', DEFAULT_SCENARIO, 0, {
      claude_enterprise_input_per1m: 6.0,
    })
    // grossTokenCost = (56,000M × 6.0) + (24,000M × 15.0) = 336,000 + 360,000 = 696,000
    expect(result.netCost).toBeCloseTo(696_000, 0)
  })
})

describe('computeScenarioResult', () => {
  it('bob tco is sum of annual costs over horizon', () => {
    const result = computeScenarioResult({ ...DEFAULT_SCENARIO, horizonYears: 3 })
    const bob = result.results.bob!
    const expected = bob.years.reduce((s, y) => s + y.netCost, 0)
    expect(bob.tco).toBeCloseTo(expected, 0)
  })

  it('bob savings vs max competitor is positive at standard tier 100 users', () => {
    const result = computeScenarioResult(DEFAULT_SCENARIO)
    expect(result.bobSavingsVsMax).toBeGreaterThan(0)
    expect(result.bobSavingsPctVsMax).toBeGreaterThan(0)
    expect(result.bobSavingsPctVsMax).toBeLessThan(1)
  })

  it('all requested platforms have results', () => {
    const result = computeScenarioResult(DEFAULT_SCENARIO)
    for (const pid of DEFAULT_SCENARIO.platforms) {
      expect(result.results[pid]).toBeDefined()
    }
  })
})
