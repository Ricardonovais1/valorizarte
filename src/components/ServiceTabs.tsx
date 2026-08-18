'use client'

import { useState } from 'react'
import { BoldText } from './BoldText'

export function ServiceTabs({ tabs }: { tabs: { label: string; body: string }[] }) {
  const [active, setActive] = useState(0)

  if (tabs.length === 0) return null

  const body = (
    <div className="flex-1 space-y-4">
      {tabs[active].body.split(/\n\n+/).map((paragraph, i) => (
        <p key={i}>
          <BoldText text={paragraph} />
        </p>
      ))}
    </div>
  )

  if (tabs.length === 1) return body

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="flex shrink-0 flex-col gap-1 sm:w-44">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(i)}
            className={`px-5 py-3 text-left text-sm font-medium transition ${
              i === active ? 'bg-navy text-white' : 'bg-sage text-navy hover:brightness-95'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {body}
    </div>
  )
}
