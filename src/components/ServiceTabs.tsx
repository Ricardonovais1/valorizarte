'use client'

import { useState } from 'react'
import { BoldText } from './BoldText'

// Rótulos muito longos (ex.: Assessoria) não cabem numa barra lateral
// estreita — nesse caso os botões viram uma pilha de largura total,
// acima do texto, em vez de ficarem ao lado.
const LONG_LABEL_THRESHOLD = 30

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

  const stacked = tabs.some((tab) => tab.label.length > LONG_LABEL_THRESHOLD)

  const buttons = (
    <div className={`flex shrink-0 flex-col gap-1 ${stacked ? 'w-full' : 'sm:w-56'}`}>
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          type="button"
          onClick={() => setActive(i)}
          className={`px-5 py-3 text-sm font-medium transition ${stacked ? 'text-center' : 'text-left'} ${
            i === active ? 'bg-navy text-white' : 'bg-sage text-navy hover:brightness-95'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )

  if (stacked) {
    return (
      <div className="flex flex-col gap-6">
        {buttons}
        {body}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      {buttons}
      {body}
    </div>
  )
}
