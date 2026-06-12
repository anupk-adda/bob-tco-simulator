import type { ScenarioConfig, PlatformId, PlatformYearCost, PlatformResult, ScenarioResult } from './types'
import { BOB, TIER_TOKENS, TIER_USAGE_ESTIMATE, COMPETITOR_DEFAULTS } from './pricing'

function getPrice(overrides: Record<string, number>, key: string, fallback: number): number {
  return key in overrides ? overrides[key] : fallback
}

export function effectiveTokensPerUserMonth(config: ScenarioConfig, usageGrowth: number): number {
  const mix = config.workloadMix
  const totalShare = mix.occasional.sharePct + mix.active.sharePct + mix.power.sharePct + mix.agentic.sharePct
  let baseTokens: number
  if (totalShare > 0) {
    baseTokens = (
      mix.occasional.sharePct * mix.occasional.tokensPerMonth +
      mix.active.sharePct * mix.active.tokensPerMonth +
      mix.power.sharePct * mix.power.tokensPerMonth +
      mix.agentic.sharePct * mix.agentic.tokensPerMonth
    ) / totalShare
  } else {
    baseTokens = TIER_TOKENS[config.usageTier] ?? TIER_TOKENS.standard
  }
  return baseTokens * usageGrowth
}

export function calculateBobYear(config: ScenarioConfig, yearIndex: number): PlatformYearCost {
  const userGrowth = Math.pow(1 + config.annualUserGrowthPct, yearIndex)
  const usageGrowth = Math.pow(1 + config.annualUsageGrowthPct, yearIndex)
  const users = Math.round(config.users * userGrowth)

  const authorizedUserMonthly = getPrice(config.priceOverrides, 'bob_user_monthly', BOB.authorizedUserMonthly)
  const ruPriceAnnual = getPrice(config.priceOverrides, 'bob_ru_annual', BOB.ruPriceAnnual)
  const overagePer1000RUs = getPrice(config.priceOverrides, 'bob_overage_1000ru', BOB.overagePer1000RUs)
  const premiumJavaMonthly = getPrice(config.priceOverrides, 'bob_java_monthly', BOB.premiumJavaMonthly)

  const usageEstimate = (TIER_USAGE_ESTIMATE[config.usageTier] ?? 1000) * usageGrowth
  const ruQty = Math.ceil((usageEstimate * users) / BOB.ruSizingDivisor)
  const includedTokens = ruQty * BOB.bobcoinsPerRU * BOB.tokensPerBobcoin

  const tokensPerUserMonth = effectiveTokensPerUserMonth(config, usageGrowth)
  const annualTokens = Math.round(users * tokensPerUserMonth * 12)

  const overageTokens = Math.max(0, annualTokens - includedTokens)
  const additionalBobcoins = Math.ceil(overageTokens / BOB.tokensPerBobcoin)
  const additionalRUs = Math.ceil(additionalBobcoins / BOB.bobcoinsPerRU)
  const overageBlocks = Math.ceil(additionalRUs / 1000)
  const overageCost = overageBlocks * overagePer1000RUs

  const seatCost = users * authorizedUserMonthly * 12
  const usageCost = ruQty * ruPriceAnnual
  const premiumJavaCost = config.premiumPackageJavaUsers * premiumJavaMonthly * 12
  const saasBase = seatCost + usageCost
  const supportCost = config.supportEnabled
    ? Math.max(BOB.supportMinAnnual, BOB.supportRateOfSaaS * saasBase)
    : 0
  const subtotal = saasBase + premiumJavaCost + supportCost + overageCost
  const discountAmount = subtotal * config.bobDiscountPct
  const netCost = subtotal - discountAmount

  return {
    year: yearIndex + 1,
    users,
    annualTokens,
    seatCost,
    usageCost,
    supportCost,
    overageCost,
    discountAmount,
    netCost,
    includedTokens,
  }
}

export function calculateCompetitorYear(
  platformId: Exclude<PlatformId, 'bob'>,
  config: ScenarioConfig,
  yearIndex: number,
  overrides: Record<string, number>
): PlatformYearCost {
  const userGrowth = Math.pow(1 + config.annualUserGrowthPct, yearIndex)
  const usageGrowth = Math.pow(1 + config.annualUsageGrowthPct, yearIndex)
  const users = Math.round(config.users * userGrowth)
  const def = COMPETITOR_DEFAULTS[platformId]

  const tokensPerUserMonth = effectiveTokensPerUserMonth(config, usageGrowth)
  const annualTokens = Math.round(users * tokensPerUserMonth * 12)

  const seatMonthly = getPrice(overrides, `${platformId}_seat_monthly`, def.seatMonthly)
  const seatCost = seatMonthly * users * 12

  // Dollar credit that offsets gross token cost (GitHub Copilot: seat = included credit value)
  const includedCreditValue = (def.includedCreditMonthly ?? 0) * users * 12

  const inputRatio = def.inputRatio ?? 0.7
  const inputTokens = annualTokens * inputRatio
  const outputTokens = annualTokens * (1 - inputRatio)
  const inputRate = getPrice(overrides, `${platformId}_input_per1m`, def.extraInputPer1M)
  const outputRate = getPrice(overrides, `${platformId}_output_per1m`, def.extraOutputPer1M)
  const grossTokenCost = (inputTokens / 1_000_000) * inputRate + (outputTokens / 1_000_000) * outputRate
  const usageCost = Math.max(0, grossTokenCost - includedCreditValue)

  return {
    year: yearIndex + 1,
    users,
    annualTokens,
    seatCost,
    usageCost,
    supportCost: 0,
    overageCost: 0,
    discountAmount: 0,
    netCost: seatCost + usageCost,
    includedTokens: 0,
  }
}

export function calculateBudgetCertainty(platformId: PlatformId, config: ScenarioConfig): number {
  const tierVariability: Record<string, number> = {
    light: 0.1, standard: 0.3, heavy: 0.5, agentic: 0.8, factory: 0.6,
  }
  const variability = tierVariability[config.usageTier] ?? 0.3
  const isPooled = platformId === 'bob'
  const isUsageBased = platformId !== 'bob'
  let score = 100
  score -= 25 * variability
  score -= isUsageBased ? 20 : 5
  score -= isUsageBased ? 10 : 0
  score += isPooled ? 20 : 0
  score += isPooled && config.supportEnabled ? 5 : 0
  return Math.round(Math.min(100, Math.max(0, score)))
}

function buildPlatformResult(platformId: PlatformId, config: ScenarioConfig): PlatformResult {
  const years: PlatformYearCost[] = []
  for (let i = 0; i < config.horizonYears; i++) {
    if (platformId === 'bob') {
      years.push(calculateBobYear(config, i))
    } else {
      years.push(calculateCompetitorYear(platformId as Exclude<PlatformId, 'bob'>, config, i, config.priceOverrides))
    }
  }
  const tco = years.reduce((s, y) => s + y.netCost, 0)
  const y0 = years[0]
  const costPerUserMonth = y0.netCost / (y0.users * 12)
  const costPer1BTokens = y0.annualTokens > 0 ? (y0.netCost / y0.annualTokens) * 1_000_000_000 : 0
  const budgetCertaintyScore = calculateBudgetCertainty(platformId, config)
  return { platformId, years, tco, costPerUserMonth, costPer1BTokens, budgetCertaintyScore }
}

export function computeScenarioResult(config: ScenarioConfig): ScenarioResult {
  const results: Partial<Record<PlatformId, PlatformResult>> = {}
  for (const pid of config.platforms) {
    results[pid] = buildPlatformResult(pid, config)
  }

  const bob = results.bob
  const competitors = config.platforms
    .filter(p => p !== 'bob')
    .map(p => results[p])
    .filter((r): r is PlatformResult => r !== undefined)

  const maxCompetitorTco = Math.max(...competitors.map(c => c.tco), 0)
  const bobSavingsVsMax = bob ? maxCompetitorTco - bob.tco : 0
  const bobSavingsPctVsMax = maxCompetitorTco > 0 ? bobSavingsVsMax / maxCompetitorTco : 0

  // Find break-even by scanning token levels
  let breakEvenTokensPerUserMonth: number | null = null
  if (bob && competitors.length > 0) {
    const tokenSteps = [25, 50, 75, 100, 150, 200, 300, 500, 750, 1000].map(v => v * 1_000_000)
    for (const t of tokenSteps) {
      const testConfig: ScenarioConfig = {
        ...config,
        workloadMix: {
          occasional: { sharePct: 25, tokensPerMonth: t },
          active: { sharePct: 25, tokensPerMonth: t },
          power: { sharePct: 25, tokensPerMonth: t },
          agentic: { sharePct: 25, tokensPerMonth: t },
        },
      }
      const bobCost = calculateBobYear(testConfig, 0).netCost
      const allCompCheaperOrEqual = competitors.every((_c) => {
        const pid = _c.platformId as Exclude<PlatformId, 'bob'>
        const compCost = calculateCompetitorYear(pid, testConfig, 0, config.priceOverrides).netCost
        return bobCost <= compCost
      })
      if (allCompCheaperOrEqual) {
        breakEvenTokensPerUserMonth = t
        break
      }
    }
  }

  return { config, results, breakEvenTokensPerUserMonth, bobSavingsVsMax, bobSavingsPctVsMax }
}
