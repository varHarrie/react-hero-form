import React, { cloneElement, isValidElement, useCallback, useContext, useState } from 'react'

import { FormStoreContext } from './form-store-context'
import { useFieldChange } from './use-field-change'
import { getPropName, getValueFromEvent } from './utils'
import { FormOptionsContext } from './form-options-context'

export interface FormItemProps {
  name?: string
  valueProp?: string | ((type: any) => string)
  valueGetter?: (...args: any[]) => any
  children?: React.ReactNode
}

export function FormItem (props: FormItemProps) {
  const { name, valueProp = 'value', valueGetter = getValueFromEvent, children } = props

  const store = useContext(FormStoreContext)
  const options = useContext(FormOptionsContext)
  const [value, setValue] = useState(name && store ? store.get(name) : undefined)
  const [error, setError] = useState(name && store ? store.error(name) : undefined)

  const onChange = useCallback(
    (...args: any[]) => name && store && store.set(name, valueGetter(...args)),
    [name, store, valueGetter]
  )

  useFieldChange(store, name, () => {
    setValue(store!.get(name!))
    setError(store!.error(name!))
  })

  let child: any = children

  if (name && store && isValidElement(child)) {
    const { errorClassName } = options
    const prop = getPropName(valueProp, child && child.type)

    let className = (child.props && (child.props as any).className) || ''
    if (error) className += ' ' + errorClassName

    const childProps = { className, [prop]: value, onChange }
    child = cloneElement(child, childProps)
  }

  return child
}
