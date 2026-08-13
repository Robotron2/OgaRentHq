'use client'

import { Check } from 'lucide-react'

export const EscrowStates = ['Created', 'Funded', 'Occupied', 'Disputed', 'Completed'] as const
export type EscrowStateString = typeof EscrowStates[number]

export const stateMap: Record<number, EscrowStateString> = {
  0: 'Created',
  1: 'Funded',
  2: 'Occupied',
  3: 'Disputed',
  4: 'Completed'
}

export default function EscrowTimeline({ currentState }: { currentState: number | undefined }) {
  const stateIndex = currentState ?? 0
  const visualIndex = Math.min(stateIndex, 2)
  const finalState = stateIndex === 3 ? 'Disputed' : stateIndex === 4 ? 'Completed' : 'Occupied'
  const displayStates = ['Created', 'Funded', finalState]

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 md:p-8">
      <h3 className="font-headline-md text-primary mb-8">Escrow Progress</h3>
      
      <div className="relative flex justify-between">
        <div className="absolute top-4 left-10 right-10 h-1 bg-surface-container-highest -translate-y-1/2 z-0 rounded-full" />
        <div 
          className="absolute top-4 left-10 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
          style={{ width: `calc(${(visualIndex / 2)} * (100% - 5rem))` }}
        />
        
        {displayStates.map((stateName, visualIdx) => {
          const isCompleted = visualIdx <= visualIndex
          const isActive = visualIdx === visualIndex
          const isDisputed = stateName === 'Disputed'
          
          return (
            <div key={stateName} className="relative z-10 flex flex-col items-center gap-3 w-20">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isDisputed 
                    ? 'bg-tertiary-fixed border-tertiary-fixed-dim text-on-tertiary-fixed-variant'
                    : isCompleted 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-white border-outline-variant text-outline-variant'
                }`}
              >
                {isCompleted && !isDisputed ? <Check size={16} strokeWidth={3} /> : <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-current' : 'bg-transparent'}`} />}
              </div>
              <span className={`font-label-caps text-[11px] leading-tight text-center ${isActive ? 'text-primary font-bold' : 'text-outline-variant'}`}>
                {stateName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
