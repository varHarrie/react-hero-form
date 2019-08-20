import React, { useCallback, useContext, useState } from 'react'

import { FormStoreContext } from './form-store-context'
import { useFieldChange } from './use-field-change'
import { getPropName, getValueFromEvent } from './utils'

export interface FormItemProps {
  name?: string
  valueProp?: string | ((type: any) => string)
  valueGetter?: (...args: any[]) => any
  children?: React.ReactNode
}

export function FormItem (props: FormItemProps) {
  const { name, valueProp = 'value', valueGetter = getValueFromEvent, children } = props

  const store = useContext(FormStoreContext)
  const [value, setValue] = useState(name && store ? store.get(name) : undefined)

  const onChange = useCallback(
    (...args: any[]) => name && store && store.set(name, valueGetter(...args)),
    [name, store, valueGetter]
  )

  useFieldChange(store, name, () => {
    setValue(store!.get(name!))
  })

  let child: any = children

  if (name && store && React.isValidElement(child)) {
    const prop = getPropName(valueProp, child && child.type)
    const childProps = { [prop]: value, onChange }
    child = React.cloneElement(child, childProps)
  }

  return child
}
