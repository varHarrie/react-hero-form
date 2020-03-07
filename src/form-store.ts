import { deepCopy, deepGet, deepSet } from './utils'

export type FormListener = (name: string) => void

export type FormValidator = (value: any, values: any) => void | Promise<void>

export type FormRules = { [key: string]: FormValidator }

export type FormErrors = { [key: string]: string | undefined }

export class FormStore<T extends Object = any> {
  private initialValues: T

  private listeners: FormListener[] = []

  private values: T

  private rules: FormRules

  private errors: FormErrors = {}

  public constructor (values: Partial<T> = {}, rules: FormRules = {}) {
    this.initialValues = values as any
    this.values = deepCopy(values) as any
    this.rules = rules

    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.reset = this.reset.bind(this)
    this.error = this.error.bind(this)
    this.validate = this.validate.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }

  private notify (name: string) {
    this.listeners.forEach((listener) => listener(name))
  }

  public get (name?: string) {
    return name === undefined ? { ...this.values } : deepGet(this.values, name)
  }

  public async set (values: Partial<T>): Promise<void>
  public async set (name: string, value: any, validate?: boolean): Promise<void>
  public async set (name: any, value?: any, validate?: boolean) {
    if (typeof name === 'string') {
      deepSet(this.values, name, value)
      this.notify(name)

      if (validate) {
        await this.validate(name).catch((err) => err)
        this.notify(name)
      }
    } else if (name) {
      await Promise.all(Object.keys(name).map((n) => this.set(n, name[n])))
    }
  }

  public reset () {
    this.errors = {}
    this.values = deepCopy(this.initialValues)
    this.notify('*')
  }

  public error (): FormErrors
  public error (name: number | string): string | undefined
  public error (name: string, value: string | undefined): string | undefined
  public error (...args: any[]) {
    let [name, value] = args

    if (args.length === 0) return this.errors

    if (typeof name === 'number') {
      name = Object.keys(this.errors)[name]
    }

    if (args.length === 2) {
      if (value === undefined) {
        delete this.errors[name]
      } else {
        this.errors[name] = value
      }
    }

    return this.errors[name]
  }

  public async validate (): Promise<T>
  public async validate (name: string): Promise<any>
  public async validate (name?: string) {
    if (name === undefined) {
      let error: Error | undefined = undefined

      try {
        await Promise.all(Object.keys(this.rules).map((n) => this.validate(n)))
      } catch (err) {
        error = err
      }

      this.notify('*')
      if (error) throw error

      return this.get()
    } else {
      const validator = this.rules[name]
      const value = this.get(name)
      let error: Error | undefined = undefined

      if (validator) {
        try {
          await validator(value, this.values)
        } catch (err) {
          error = err
        }
      }

      this.error(name, error && error.message)
      if (error) throw error

      return value
    }
  }

  public subscribe (listener: FormListener) {
    this.listeners.push(listener)

    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) this.listeners.splice(index, 1)
    }
  }
}
