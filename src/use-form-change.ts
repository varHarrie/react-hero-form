import { useEffect } from 'react'

import { FormStore } from './form-store'

export function useFormChange<T> (
  store: FormStore<T> | undefined,
  onChange: (name: string) => void
) {
  useEffect(() => {
    if (!store) return

    return store.subscribe((n) => {
      onChange(n)
    })
  }, [store])
}
