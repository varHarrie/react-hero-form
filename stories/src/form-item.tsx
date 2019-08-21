import React from 'react'
import { storiesOf } from '@storybook/react'
import { Form, FormStore } from 'react-hero-form'

storiesOf('Form', module).add('items', () => {
  const store = new FormStore(
    {
      username: 'Default',
      password: '',
      gender: 'male',
      contact: {
        phone: '',
        address: ''
      }
    },
    {
      username: (val) => !!val.trim() || 'Name is required',
      password: (val) => !!val.trim() || 'Password is required',
      'contact.phone': (val) => /[0-9]{11}/.test(val) || 'Phone is invalid',
      'contact.address': async (val) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(!!val.trim() || 'Address is required')
          }, 1000)
        })
      }
    }
  )

  store.subscribe((name) => {
    console.log('change', name, store.get(name))
  })

  const onReset = (e: React.FormEvent) => {
    e.preventDefault()
    store.reset()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const [error, values] = await store.validate()
    console.log(error, values)
  }

  return (
    <Form store={store} errorClassName='error' onSubmit={onSubmit} onReset={onReset}>
      <Form.Item name='username'>
        <input type='text' />
      </Form.Item>
      <Form.Item name='password'>
        <input type='password' />
      </Form.Item>
      <Form.Item name='gender'>
        <select>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
      </Form.Item>
      <Form.Item name='contact.phone'>
        <input type='text' />
      </Form.Item>
      <Form.Item name='contact.address'>
        <input type='text' />
      </Form.Item>
      <Form.Item>
        <button type='reset'>Reset</button>
        <button type='submit'>Submit</button>
      </Form.Item>
    </Form>
  )
})
