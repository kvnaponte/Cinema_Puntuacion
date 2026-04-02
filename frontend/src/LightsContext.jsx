import { createContext, useContext, useState } from 'react'

const LightsContext = createContext({ lightsOn: true, toggleLights: () => {} })

export function LightsProvider({ children }) {
  const [lightsOn, setLightsOn] = useState(true)
  return (
    <LightsContext.Provider value={{ lightsOn, toggleLights: () => setLightsOn(v => !v) }}>
      {children}
    </LightsContext.Provider>
  )
}

export function useLights() {
  return useContext(LightsContext)
}
