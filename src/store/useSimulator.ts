import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScenarioConfig, PriceAssumption } from '../engine/types'
import { PRESET_SCENARIOS, DEFAULT_SCENARIO } from '../engine/scenarios'
import { DEFAULT_PRICE_ASSUMPTIONS, DEFAULT_ACCELERATOR_COMPONENTS } from '../engine/pricing'
import type { AcceleratorComponent } from '../engine/types'

interface SimulatorState {
  activeScenarioId: string
  scenarios: ScenarioConfig[]
  customMode: boolean
  priceAssumptions: PriceAssumption[]
  acceleratorComponents: AcceleratorComponent[]

  setActiveScenario: (id: string) => void
  updateScenario: (patch: Partial<ScenarioConfig>) => void
  setCustomMode: (on: boolean) => void
  setPriceOverride: (key: string, value: number) => void
  resetPriceOverrides: () => void
  updatePriceAssumption: (id: string, unitPrice: number) => void
  setAcceleratorGain: (gain: number) => void
}

export const useSimulator = create<SimulatorState>()(
  persist(
    (set, get) => ({
      activeScenarioId: DEFAULT_SCENARIO.id,
      scenarios: PRESET_SCENARIOS,
      customMode: false,
      priceAssumptions: DEFAULT_PRICE_ASSUMPTIONS,
      acceleratorComponents: DEFAULT_ACCELERATOR_COMPONENTS,

      setActiveScenario: (id) => set({ activeScenarioId: id }),

      updateScenario: (patch) =>
        set((s) => ({
          scenarios: s.scenarios.map((sc) =>
            sc.id === s.activeScenarioId ? { ...sc, ...patch } : sc
          ),
        })),

      setCustomMode: (on) => set({ customMode: on }),

      setPriceOverride: (key, value) => {
        const { scenarios, activeScenarioId } = get()
        set({
          scenarios: scenarios.map((sc) =>
            sc.id === activeScenarioId
              ? { ...sc, priceOverrides: { ...sc.priceOverrides, [key]: value } }
              : sc
          ),
        })
      },

      resetPriceOverrides: () =>
        set((s) => ({
          scenarios: s.scenarios.map((sc) =>
            sc.id === s.activeScenarioId ? { ...sc, priceOverrides: {} } : sc
          ),
          priceAssumptions: DEFAULT_PRICE_ASSUMPTIONS,
        })),

      updatePriceAssumption: (id, unitPrice) =>
        set((s) => ({
          priceAssumptions: s.priceAssumptions.map((a) =>
            a.id === id ? { ...a, unitPrice, sourceType: 'custom_override' as const } : a
          ),
        })),

      setAcceleratorGain: (gain) => {
        const { scenarios, activeScenarioId } = get()
        set({
          scenarios: scenarios.map((sc) =>
            sc.id === activeScenarioId ? { ...sc, acceleratorEfficiencyGain: gain } : sc
          ),
        })
      },
    }),
    { name: 'bob-tco-simulator' }
  )
)

export function useActiveScenario(): ScenarioConfig {
  const { scenarios, activeScenarioId } = useSimulator()
  return scenarios.find((s) => s.id === activeScenarioId) ?? DEFAULT_SCENARIO
}
