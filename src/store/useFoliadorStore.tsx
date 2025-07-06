import { createActor } from 'xstate'
import { pdfFolioOrchestrator } from './FoliadorStore'
import { useEffect, useState } from 'react'

// Crear el actor global
export const myActor = createActor(pdfFolioOrchestrator).start()

// Hook personalizado
export function useFoliadorStore() {
  const [snapshot, setSnapshot] = useState(myActor.getSnapshot())

  useEffect(() => {
    const subscription = myActor.subscribe(setSnapshot)
    return () => subscription.unsubscribe()
  }, [])

  return [snapshot, myActor.send] as const
}
