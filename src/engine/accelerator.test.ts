import { describe, it, expect } from 'vitest'
import { computeAccelerator } from './accelerator'
import { computeScenarioResult } from './calculator'
import { DEFAULT_SCENARIO } from './scenarios'

describe('computeAccelerator', () => {
  it('reduces bob tco by efficiency gain', () => {
    const scenario = { ...DEFAULT_SCENARIO, acceleratorEfficiencyGain: 0.15 }
    const base = computeScenarioResult(scenario)
    const accel = computeAccelerator(base)
    expect(accel.bobAcceleratorTco).toBeLessThan(accel.bobBaseTco)
    expect(accel.efficiencySavings).toBeCloseTo(accel.bobBaseTco * 0.15, 0)
    expect(accel.bobAcceleratorTco).toBeCloseTo(accel.bobBaseTco * 0.85, 0)
  })

  it('total value vs max is greater than scenario bobSavingsVsMax', () => {
    const base = computeScenarioResult(DEFAULT_SCENARIO)
    const accel = computeAccelerator(base)
    expect(accel.totalValueVsMax).toBeGreaterThan(base.bobSavingsVsMax)
  })

  it('conservative 8% gain still saves meaningfully', () => {
    const scenario = { ...DEFAULT_SCENARIO, acceleratorEfficiencyGain: 0.08 }
    const base = computeScenarioResult(scenario)
    const accel = computeAccelerator(base)
    expect(accel.efficiencySavings).toBeGreaterThan(0)
    expect(accel.efficiencySavings).toBeCloseTo(accel.bobBaseTco * 0.08, 0)
  })

  it('throws when bob is not in platforms', () => {
    const scenario = { ...DEFAULT_SCENARIO, platforms: ['github_copilot'] as any }
    const base = computeScenarioResult(scenario)
    expect(() => computeAccelerator(base)).toThrow()
  })
})
