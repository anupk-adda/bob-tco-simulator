import { useState } from 'react'
import { useSimulator } from './store/useSimulator'
import { ScenarioPicker } from './components/shared/ScenarioPicker'
import { ModeToggle } from './components/shared/ModeToggle'
import { BobAccelerationProgram } from './components/Program/BobAccelerationProgram'
import { Dashboard } from './components/Dashboard/Dashboard'
import { ScaleSimulator } from './components/ScaleSimulator/ScaleSimulator'
import { WorkloadMix } from './components/WorkloadMix/WorkloadMix'
import { CostBreakdown } from './components/CostBreakdown/CostBreakdown'
import { AcceleratorROI } from './components/Accelerator/AcceleratorROI'
import { Assumptions } from './components/Assumptions/Assumptions'

const TCO_TABS = [
  { id: 'dashboard',   label: 'Executive Dashboard' },
  { id: 'scale',       label: 'Scale Simulator' },
  { id: 'workload',    label: 'Workload Mix' },
  { id: 'breakdown',   label: 'Cost Breakdown' },
  { id: 'accelerator', label: 'Bob Accelerator ROI' },
  { id: 'assumptions', label: 'Assumptions' },
]

export default function App() {
  const [mainTab, setMainTab] = useState<'program' | 'tco'>('program')
  const [tcoTab, setTcoTab] = useState('dashboard')
  const { customMode, setCustomMode } = useSimulator()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        {/* Top row: brand + main tabs */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src="/bob-logo.png" alt="Bob" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Bob Acceleration Program</p>
              <p className="text-xs text-ibm-blue font-medium leading-tight">IBM Client Engineering</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1 ml-4">
            <button
              type="button"
              onClick={() => setMainTab('program')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mainTab === 'program'
                  ? 'bg-ibm-blue text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Acceleration Program
            </button>
            <button
              type="button"
              onClick={() => setMainTab('tco')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mainTab === 'tco'
                  ? 'bg-ibm-blue text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              TCO Simulator
            </button>
          </div>
        </div>

        {/* TCO sub-navigation */}
        {mainTab === 'tco' && (
          <>
            {/* Sub-tabs */}
            <div className="max-w-7xl mx-auto px-6 flex gap-0 border-t border-gray-100 overflow-x-auto">
              {TCO_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTcoTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                    tcoTab === tab.id
                      ? 'border-ibm-blue text-ibm-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scenario + mode controls bar */}
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-4 bg-gray-50 border-t border-gray-100">
              <ScenarioPicker />
              <div className="ml-auto">
                <ModeToggle customMode={customMode} onChange={setCustomMode} />
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {mainTab === 'program' && <BobAccelerationProgram />}
        {mainTab === 'tco' && (
          <>
            {tcoTab === 'dashboard'   && <Dashboard />}
            {tcoTab === 'scale'       && <ScaleSimulator />}
            {tcoTab === 'workload'    && <WorkloadMix />}
            {tcoTab === 'breakdown'   && <CostBreakdown />}
            {tcoTab === 'accelerator' && <AcceleratorROI />}
            {tcoTab === 'assumptions' && <Assumptions />}
          </>
        )}
      </main>
    </div>
  )
}
