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
      'contact.address': (val) => !!val.trim() || 'Address is required'
    }
  )

  store.subscribe((name) => {
    console.log('change', name, store.get(name))
  })

  const onReset = (e: React.MouseEvent) => {
    e.preventDefault()
    store.reset()
  }

  const onSubmit = (e: React.MouseEvent) => {
    e.preventDefault()

    const [error, values] = store.validate()
    console.log(error, values)
  }

  return (
    <Form store={store} errorClassName='error'>
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
        <button onClick={onReset}>Reset</button>
        <button onClick={onSubmit}>Submit</button>
      </Form.Item>
    </Form>
  )
})
