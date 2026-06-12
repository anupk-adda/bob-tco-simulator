import type { ScenarioResult } from './types'

export interface AcceleratorResult {
  bobBaseTco: number
  efficiencySavings: number
  bobAcceleratorTco: number
  totalValueVsMax: number
  maxCompetitorTco: number
}

export function computeAccelerator(scenarioResult: ScenarioResult): AcceleratorResult {
  const bob = scenarioResult.results.bob
  if (!bob) throw new Error('Bob must be in selected platforms to compute Accelerator savings')

  const gain = scenarioResult.config.acceleratorEfficiencyGain
  const bobBaseTco = bob.tco
  const efficiencySavings = bobBaseTco * gain
  const bobAcceleratorTco = bobBaseTco - efficiencySavings

  const competitors = Object.entries(scenarioResult.results)
    .filter(([id]) => id !== 'bob')
    .map(([, r]) => r!.tco)
  const maxCompetitorTco = Math.max(...competitors, 0)
  const totalValueVsMax = maxCompetitorTco - bobAcceleratorTco

  return { bobBaseTco, efficiencySavings, bobAcceleratorTco, totalValueVsMax, maxCompetitorTco }
}
