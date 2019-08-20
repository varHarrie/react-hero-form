import React from 'react'

export interface FormOptions {
  inline?: boolean
  compact?: boolean
  required?: boolean
  labelWidth?: number
  gutter?: number
  errorClassName?: string
}

export const FormOptionsContext = React.createContext<FormOptions>({})
