import React from 'react'
import { Router } from 'react-router-dom'
import { act, fireEvent, render } from '@testing-library/react'

import { createMemoryHistory } from 'history'
import MockAdapter from 'axios-mock-adapter'

import Context from '../context/UserContext'
import http from '../http-common'
import Checkout from '../pages/Checkout'

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const mockHistoryPush = jest.fn()

window.alert = () => {}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}))

jest.mock('@stripe/react-stripe-js', () => ({
  ...jest.requireActual('@stripe/react-stripe-js'),
  useStripe: () => ({
    createPaymentMethod: () => ({ error: undefined, paymentMethod: { id: 1 } }),
  }),
  useElements: () => ({
    getElement: () => {},
  }),
}))

const auth = {
  username: 'test-user',
  email: 'test@user.com',
  roles: ['ROLE_OWNER'],
  tokenType: 'Bearer',
  accessToken:
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg',
}

describe('Render checkout', () => {
  let stripeMockFn
  let stripeMockResult

  beforeEach(() => {
    stripeMockResult = {
      elements: jest.fn(),
      createToken: jest.fn(),
      createSource: jest.fn(),
      createPaymentMethod: jest.fn(),
      handleCardPayment: jest.fn(),
    }
    stripeMockFn = jest.fn().mockReturnValue(stripeMockResult)
    window.Stripe = stripeMockFn
  })

  it('Render checkout with correct data', async () => {
    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Checkout />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let addTitle = await rendered.findByText('Añadir método de pago')
    expect(addTitle).toBeInTheDocument()
  })

  it('Send credit card successfully', async () => {
    mockAxios.onPost().replyOnce(200, {})

    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Checkout />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let button = await rendered.findByText('Añadir')
    fireEvent.click(button)

    let promise2 = new Promise((r) => setTimeout(r, 250))
    await act(() => promise2)

    expect(mockHistoryPush).toHaveBeenCalledWith('/payments/subscriptions')
  })
})
