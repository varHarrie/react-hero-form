import React, { cloneElement, isValidElement, useCallback, useContext, useState } from 'react'

import { FormStoreContext } from './form-store-context'
import { useFieldChange } from './use-field-change'
import { FormOptions, FormOptionsContext } from './form-options-context'
import { getPropName, getValueFromEvent } from './utils'

export interface FormFieldProps extends FormOptions {
  className?: string
  label?: string
  name?: string
  valueProp?: string | ((type: any) => string)
  valueGetter?: (...args: any[]) => any
  suffix?: React.ReactNode
  children?: React.ReactNode
}

export function FormField (props: FormFieldProps) {
  const {
    className,
    label,
    name,
    valueProp = 'value',
    valueGetter = getValueFromEvent,
    suffix,
    children,
    ...restProps
  } = props

  const store = useContext(FormStoreContext)
  const options = useContext(FormOptionsContext)
  const [value, setValue] = useState(name && store ? store.get(name) : undefined)
  const [error, setError] = useState(name && store ? store.error(name) : undefined)

  const onChange = useCallback(
    (...args: any[]) => name && store && store.set(name, valueGetter(...args), true),
    [name, store, valueGetter]
  )

  useFieldChange(store, name, () => {
    setValue(store!.get(name!))
    setError(store!.error(name!))
  })

  const { inline, compact, required, labelWidth, gutter, errorClassName = 'error' } = {
    ...options,
    ...restProps
  }

  let child: any = children

  if (name && store && isValidElement(child)) {
    const prop = getPropName(valueProp, child && child.type)

    let childClassName = (child.props && (child.props as any).className) || ''
    if (error) childClassName += ' ' + errorClassName

    const childProps = { className: childClassName, [prop]: value, onChange }
    child = cloneElement(child, childProps)
  }

  const classNames = [
    classes.field,
    inline ? classes.inline : '',
    compact ? classes.compact : '',
    required ? classes.required : '',
    error ? classes.error : '',
    className ? className : ''
  ].join('')

  const headerStyle = {
    width: labelWidth,
    marginRight: gutter
  }

  return (
    <div className={classNames}>
      {label !== undefined && (
        <div className={classes.header} style={headerStyle}>
          {label}
        </div>
      )}
      <div className={classes.container}>
        <div className={classes.control}>{child}</div>
        <div className={classes.message}>{error}</div>
      </div>
      {suffix !== undefined && <div className={classes.footer}>{suffix}</div>}
    </div>
  )
}

const classes = {
  field: 'rh-form-field ',
  inline: 'rh-form-field--inline ',
  compact: 'rh-form-field--compact ',
  required: 'rh-form-field--required ',
  error: 'rh-form-field--error ',

  header: 'rh-form-field__header',
  container: 'rh-form-field__container',
  control: 'rh-form-field__control',
  message: 'rh-form-field__message',
  footer: 'rh-form-field__footer'
}
