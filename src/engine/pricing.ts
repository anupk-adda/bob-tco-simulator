import type { PlatformId, AcceleratorComponent, PriceAssumption } from './types'

export const BOB = {
  authorizedUserMonthly: 20,
  ruPriceAnnual: 500.04,
  bobcoinsPerRU: 1_000,
  tokensPerBobcoin: 400_000,
  overagePer1000RUs: 550,
  premiumJavaMonthly: 20,
  supportMinAnnual: 40_000,
  supportRateOfSaaS: 0.15,
  ruSizingDivisor: 500,
} as const

// Tokens per user per month for each tier (fallback when workloadMix totalShare = 0)
export const TIER_TOKENS: Record<string, number> = {
  light:    25_000_000,
  standard: 66_666_700,  // matches 100-user high-consumption SDLC baseline (80B/year)
  heavy:   200_000_000,
  agentic: 500_000_000,
  factory: 1_000_000_000,
}

// Usage estimate (USD/user/year) to size Bob RU pool for each tier
export const TIER_USAGE_ESTIMATE: Record<string, number> = {
  light:    375,
  standard: 1_000,
  heavy:    3_000,
  agentic:  7_500,
  factory:  15_000,
}

export const COMPETITOR_DEFAULTS: Record<string, {
  seatMonthly: number
  includedCreditMonthly?: number   // dollar credit that offsets gross token cost (GitHub Copilot model)
  includedTokensPerUserMonth: number
  extraInputPer1M: number
  extraOutputPer1M: number
  inputRatio: number
  sensitivityBand?: number
  label: string
  color: string
  sourceUrl: string
}> = {
  github_copilot: {
    label: 'GitHub Copilot Enterprise',
    color: '#24292E',
    // Seat price = included credit value; gross token cost is additional
    seatMonthly: 39,
    includedCreditMonthly: 39,
    includedTokensPerUserMonth: 0,
    extraInputPer1M: 1.75,   // GPT-5.3-Codex rate
    extraOutputPer1M: 14.0,
    inputRatio: 0.7,
    sourceUrl: 'https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing',
  },
  claude_enterprise: {
    label: 'Claude Enterprise',
    color: '#D97706',
    seatMonthly: 0,           // enterprise access fee excluded / negotiated separately
    includedTokensPerUserMonth: 0,
    extraInputPer1M: 3.0,    // Claude Sonnet 4.6
    extraOutputPer1M: 15.0,
    inputRatio: 0.7,
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/pricing',
  },
  gemini_code_assist: {
    label: 'Gemini Code Assist Enterprise',
    color: '#4285F4',
    seatMonthly: 45,
    includedTokensPerUserMonth: 0,
    extraInputPer1M: 1.25,   // Gemini 2.5 Pro rate
    extraOutputPer1M: 10.0,
    inputRatio: 0.7,
    sourceUrl: 'https://codeassist.google/products/business',
  },
}

export const BOB_COLOR = '#0F62FE'

export const PLATFORM_LABEL: Record<PlatformId, string> = {
  bob: 'IBM Bob Enterprise',
  github_copilot: 'GitHub Copilot Enterprise',
  claude_enterprise: 'Claude Enterprise',
  gemini_code_assist: 'Gemini Code Assist Enterprise',
}

export const PLATFORM_COLOR: Record<PlatformId, string> = {
  bob: BOB_COLOR,
  github_copilot: '#24292E',
  claude_enterprise: '#D97706',
  gemini_code_assist: '#4285F4',
}

// Bob Cost Optimization & Governance Service savings drivers
export const DEFAULT_ACCELERATOR_COMPONENTS: AcceleratorComponent[] = [
  {
    id: 'cost_governance',
    title: 'Cost Governance',
    description: 'Bobcoin burn-rate tracking, consumption forecast, threshold alerts, and overage risk analysis per team',
    savingsDriver: 'Prevents runaway overage — right-sizes the RU pool before quarter-end surprises hit the budget',
    savingsPct: 0.05,
  },
  {
    id: 'optimization_advisory',
    title: 'Optimisation Advisory',
    description: 'Right-size the Bobcoin pool, identify inefficient prompt and agent patterns, build reusable workflow modes',
    savingsDriver: 'Shifts developers to lower-cost patterns; reduces duplicate and repeated token-heavy workflows',
    savingsPct: 0.04,
  },
  {
    id: 'best_practices',
    title: 'Best Practices',
    description: 'IBM-proven AI adoption frameworks, prompt engineering standards, and governance playbooks tailored to your SDLC',
    savingsDriver: 'Accelerates developer proficiency — faster ramp-up reduces wasted tokens from trial-and-error usage',
    savingsPct: 0.06,
  },
]

// IDs here MUST match the keys used in calculator.ts getPrice() calls
export const DEFAULT_PRICE_ASSUMPTIONS: PriceAssumption[] = [
  {
    id: 'bob_user_monthly',
    platformId: 'bob',
    component: 'Bob — Authorized User',
    unitPrice: 20,
    unit: 'user/month',
    sourceType: 'public_list',
    sourceUrl: 'IBM Bob Calculator D135HZX',
    effectiveDate: '2026-02-10',
    confidence: 'high',
    notes: 'IBM Bob Enterprise Authorized User Per Month',
  },
  {
    id: 'bob_ru_annual',
    platformId: 'bob',
    component: 'Bob — Pooled Consumption RU',
    unitPrice: 500.04,
    unit: 'RU/year',
    sourceType: 'public_list',
    sourceUrl: 'IBM Bob Calculator D14FNZX',
    effectiveDate: '2026-02-13',
    confidence: 'high',
    notes: 'IBM Bob Enterprise Pooled Consumption 1000 RUs per Annum',
  },
  {
    id: 'bob_overage_1000ru',
    platformId: 'bob',
    component: 'Bob — Overage (1000 RU block)',
    unitPrice: 550,
    unit: 'per 1000-RU block',
    sourceType: 'public_list',
    sourceUrl: 'IBM Bob Calculator D1613ZX',
    effectiveDate: '2026-04-07',
    confidence: 'high',
    notes: 'IBM Bob Enterprise Pooled Consumption 1000 RUs Overage',
  },
  {
    id: 'bob_java_monthly',
    platformId: 'bob',
    component: 'Bob — Premium Package for Java',
    unitPrice: 20,
    unit: 'user/month (additional)',
    sourceType: 'public_list',
    sourceUrl: 'IBM Bob Calculator D14FLZX',
    effectiveDate: '2026-02-10',
    confidence: 'high',
    notes: 'IBM Bob Premium Package for Java Modernization Enterprise Authorized User',
  },
  {
    id: 'github_copilot_seat_monthly',
    platformId: 'github_copilot',
    component: 'GitHub Copilot — Enterprise seat',
    unitPrice: 39,
    unit: 'user/month',
    sourceType: 'public_list',
    sourceUrl: 'https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/',
    effectiveDate: '2026-01-01',
    confidence: 'high',
    notes: 'Seat price equals monthly included AI credit value. Token usage above credit is billed separately.',
  },
  {
    id: 'github_copilot_input_per1m',
    platformId: 'github_copilot',
    component: 'GitHub Copilot — Input tokens (GPT-5.3-Codex)',
    unitPrice: 1.75,
    unit: 'per 1M tokens',
    sourceType: 'public_list',
    sourceUrl: 'https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing',
    effectiveDate: '2026-01-01',
    confidence: 'high',
    notes: 'GPT-5.3-Codex input rate used for high-consumption SDLC simulation',
  },
  {
    id: 'github_copilot_output_per1m',
    platformId: 'github_copilot',
    component: 'GitHub Copilot — Output tokens (GPT-5.3-Codex)',
    unitPrice: 14.0,
    unit: 'per 1M tokens',
    sourceType: 'public_list',
    sourceUrl: 'https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing',
    effectiveDate: '2026-01-01',
    confidence: 'high',
    notes: 'GPT-5.3-Codex output rate',
  },
  {
    id: 'claude_enterprise_seat_monthly',
    platformId: 'claude_enterprise',
    component: 'Claude — Enterprise access fee',
    unitPrice: 0,
    unit: 'user/month',
    sourceType: 'derived_estimate',
    sourceUrl: 'https://support.claude.com/en/articles/9797531-what-is-the-enterprise-plan',
    effectiveDate: '2026-01-01',
    confidence: 'medium',
    notes: 'Enterprise access fee excluded / assumed negotiated separately. Set to 0 to model token cost only.',
  },
  {
    id: 'claude_enterprise_input_per1m',
    platformId: 'claude_enterprise',
    component: 'Claude — Input tokens (Sonnet 4.6)',
    unitPrice: 3.0,
    unit: 'per 1M tokens',
    sourceType: 'public_list',
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/pricing',
    effectiveDate: '2026-01-01',
    confidence: 'high',
    notes: 'Claude Sonnet 4.6 API rate — all usage billed from first token',
  },
  {
    id: 'claude_enterprise_output_per1m',
    platformId: 'claude_enterprise',
    component: 'Claude — Output tokens (Sonnet 4.6)',
    unitPrice: 15.0,
    unit: 'per 1M tokens',
    sourceType: 'public_list',
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/pricing',
    effectiveDate: '2026-01-01',
    confidence: 'high',
    notes: 'Claude Sonnet 4.6 API rate',
  },
  {
    id: 'gemini_code_assist_seat_monthly',
    platformId: 'gemini_code_assist',
    component: 'Gemini Code Assist — Enterprise seat',
    unitPrice: 45,
    unit: 'user/month',
    sourceType: 'public_list',
    sourceUrl: 'https://codeassist.google/products/business',
    effectiveDate: '2026-01-01',
    confidence: 'high',
    notes: 'Gemini Code Assist Enterprise annual commitment price',
  },
  {
    id: 'gemini_code_assist_input_per1m',
    platformId: 'gemini_code_assist',
    component: 'Gemini Code Assist — Input tokens (Gemini 2.5 Pro)',
    unitPrice: 1.25,
    unit: 'per 1M tokens',
    sourceType: 'public_list',
    sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    effectiveDate: '2026-01-01',
    confidence: 'medium',
    notes: 'Gemini 2.5 Pro token-equivalent rate for high-consumption SDLC simulation',
  },
  {
    id: 'gemini_code_assist_output_per1m',
    platformId: 'gemini_code_assist',
    component: 'Gemini Code Assist — Output tokens (Gemini 2.5 Pro)',
    unitPrice: 10.0,
    unit: 'per 1M tokens',
    sourceType: 'public_list',
    sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    effectiveDate: '2026-01-01',
    confidence: 'medium',
    notes: 'Gemini 2.5 Pro token-equivalent output rate',
  },
]
