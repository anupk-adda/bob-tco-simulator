export type UsageTier = 'light' | 'standard' | 'heavy' | 'agentic' | 'factory'
export type PlatformId = 'bob' | 'github_copilot' | 'claude_enterprise' | 'gemini_code_assist'
export type SourceType = 'public_list' | 'derived_estimate' | 'custom_override' | 'seller_entered'

export interface PersonaMix {
  occasional: { sharePct: number; tokensPerMonth: number }
  active:     { sharePct: number; tokensPerMonth: number }
  power:      { sharePct: number; tokensPerMonth: number }
  agentic:    { sharePct: number; tokensPerMonth: number }
}

export interface ScenarioConfig {
  id: string
  name: string
  users: number
  usageTier: UsageTier
  horizonYears: 1 | 3
  annualUserGrowthPct: number
  annualUsageGrowthPct: number
  bobDiscountPct: number
  supportEnabled: boolean
  premiumPackageJavaUsers: number
  workloadMix: PersonaMix
  acceleratorEfficiencyGain: number
  platforms: PlatformId[]
  priceOverrides: Record<string, number>
}

export interface PlatformYearCost {
  year: number
  users: number
  annualTokens: number
  seatCost: number
  usageCost: number
  supportCost: number
  overageCost: number
  discountAmount: number
  netCost: number
  includedTokens: number
}

export interface PlatformResult {
  platformId: PlatformId
  years: PlatformYearCost[]
  tco: number
  costPerUserMonth: number
  costPer1BTokens: number
  budgetCertaintyScore: number
}

export interface ScenarioResult {
  config: ScenarioConfig
  results: Partial<Record<PlatformId, PlatformResult>>
  breakEvenTokensPerUserMonth: number | null
  bobSavingsVsMax: number
  bobSavingsPctVsMax: number
}

export interface AcceleratorComponent {
  id: string
  title: string
  description: string
  savingsDriver: string
  savingsPct: number
}

export interface PriceAssumption {
  id: string
  platformId: PlatformId
  component: string
  unitPrice: number
  unit: string
  sourceType: SourceType
  sourceUrl: string
  effectiveDate: string
  confidence: 'high' | 'medium' | 'low'
  notes: string
}
