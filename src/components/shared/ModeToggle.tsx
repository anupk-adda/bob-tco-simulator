interface Props {
  customMode: boolean
  onChange: (v: boolean) => void
}

export function ModeToggle({ customMode, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm flex-shrink-0">
      <span className={!customMode ? 'font-semibold text-gray-900' : 'text-gray-400'}>Quick</span>
      <button
        type="button"
        onClick={() => onChange(!customMode)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          customMode ? 'bg-ibm-blue' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            customMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={customMode ? 'font-semibold text-ibm-blue' : 'text-gray-400'}>Custom</span>
    </div>
  )
}
