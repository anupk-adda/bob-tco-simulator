import { PRESET_SCENARIOS } from '../../engine/scenarios'
import { useSimulator } from '../../store/useSimulator'

export function ScenarioPicker() {
  const { activeScenarioId, setActiveScenario } = useSimulator()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-400 flex-shrink-0">Scenario</span>
      <select
        value={activeScenarioId}
        onChange={(e) => setActiveScenario(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-ibm-blue/20 focus:border-ibm-blue"
      >
        {PRESET_SCENARIOS.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  )
}
