import { useMemo } from 'react'

import { FormRules, FormStore } from './form-store'

export function useFormStore<T extends Object = any> (
  values: Partial<T> = {},
  rules: FormRules = {}
) {
  return useMemo(() => new FormStore(values, rules), [])
}
