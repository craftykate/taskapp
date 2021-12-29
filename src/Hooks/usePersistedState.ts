// Packages
import React from 'react'
import { set, get } from 'idb-keyval'

export function usePersistedState<TState>(
  keyToPersistWith: string,
  defaultState: TState
) {
  const [state, setState] = React.useState<TState | undefined>(undefined)

  React.useEffect(() => {
    get<TState>(keyToPersistWith).then((retrievedState) =>
      // If a value is retrieved then use it; otherwise default to defaultValue
      setState(retrievedState ?? defaultState)
    )
  }, [keyToPersistWith, setState, defaultState])

  const setPersistedValue = React.useCallback(
    (newValue: TState) => {
      setState(newValue)
      set(keyToPersistWith, newValue)
    },
    [keyToPersistWith, setState]
  )

  return [state, setPersistedValue] as const
}
