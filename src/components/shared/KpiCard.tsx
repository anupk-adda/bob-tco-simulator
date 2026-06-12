interface Props {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}

export function KpiCard({ label, value, sub, highlight }: Props) {
  return (
    <div className={`rounded-xl p-5 shadow-sm border ${highlight ? 'bg-ibm-blue text-white border-ibm-blue' : 'bg-white border-gray-100'}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${highlight ? 'text-blue-200' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold leading-tight ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
      {sub && (
        <p className={`mt-0.5 text-sm ${highlight ? 'text-blue-200' : 'text-gray-500'}`}>{sub}</p>
      )}
    </div>
  )
}
