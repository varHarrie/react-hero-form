import { useEffect } from 'react'

import { FormStore } from './form-store'

export function useFieldChange<T> (
  store: FormStore<T> | undefined,
  name: string | undefined,
  onChange: (name: string) => void
) {
  useEffect(() => {
    if (!name || !store) return

    return store.subscribe((n) => {
      if (name === '*' || n === name || n === '*') {
        onChange(name)
      }
    })
  }, [name, store])
}
