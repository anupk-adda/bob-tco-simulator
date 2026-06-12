import { useMemo } from 'react'
import { useActiveScenario } from '../../store/useSimulator'
import { ScaleCostChart } from './ScaleCostChart'
import { ScaleTable } from './ScaleTable'

export function ScaleSimulator() {
  const activeScenario = useActiveScenario()
  const config = useMemo(() => activeScenario, [activeScenario])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Scale Simulator</h2>
        <p className="text-sm text-gray-500 mt-1">
          See how Bob's pooled-token economics create a widening cost advantage as your team grows.
        </p>
      </div>
      <ScaleCostChart config={config} />
      <ScaleTable config={config} />
    </div>
  )
}
