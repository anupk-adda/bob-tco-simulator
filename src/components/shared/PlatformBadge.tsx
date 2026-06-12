import { PLATFORM_LABEL, PLATFORM_COLOR } from '../../engine/pricing'
import type { PlatformId } from '../../engine/types'

export function PlatformBadge({ id }: { id: PlatformId }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
      <span
        className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
        style={{ background: PLATFORM_COLOR[id] }}
      />
      {PLATFORM_LABEL[id]}
    </span>
  )
}
