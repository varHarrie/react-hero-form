import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, number } from '@storybook/addon-knobs'
import { Form, FormStore } from 'react-hero-form'

function assert (condition: any, message?: string) {
  if (!condition) throw new Error(message)
}

storiesOf('Form', module).add('fields', () => {
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
      username: (val) => assert(!!val.trim(), 'Name is required'),
      password: (val) => assert(!!val.trim(), 'Password is required'),
      'contact.phone': (val) => assert(/[0-9]{11}/.test(val), 'Phone is invalid'),
      'contact.address': (val) => assert(!!val.trim(), 'Address is required')
    }
  )

  store.subscribe((name) => {
    console.log('change', name, store.get(name))
  })

  const onReset = (e: React.MouseEvent) => {
    e.preventDefault()
    store.reset()
  }

  const onSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      const values = await store.validate()
      console.log('values:', values)
    } catch (error) {
      console.log('error:', error)
    }
  }

  return (
    <Form
      store={store}
      inline={boolean('Inline', false)}
      compact={boolean('Compact', false)}
      required={boolean('Required', false)}
      labelWidth={number('Label Width', 120)}
      gutter={number('Gutter', 20)}
    >
      <Form.Field label='Username' name='username'>
        <input type='text' />
      </Form.Field>
      <Form.Field label='Password' name='password'>
        <input type='password' />
      </Form.Field>
      <Form.Field label='Gender' name='gender'>
        <select>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
      </Form.Field>
      <Form.Field label='Phone' name='contact.phone'>
        <input type='text' />
      </Form.Field>
      <Form.Field label='Address' name='contact.address'>
        <input type='text' />
      </Form.Field>
      <Form.Field label=''>
        <button onClick={onReset}>Reset</button>
        <button onClick={onSubmit}>Submit</button>
      </Form.Field>
    </Form>
  )
})
