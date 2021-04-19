import React from 'react'
import { Router } from 'react-router-dom'
import { act, fireEvent, render } from '@testing-library/react'

import { createMemoryHistory } from 'history'
import MockAdapter from 'axios-mock-adapter'

import Context from '../context/UserContext'
import http from '../http-common'
import Subscribe from '../pages/Subscribe'

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
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

const cards = [
  {
    brand: 'visa',
    last4: '4444',
    default: false,
    token: 'card_token',
  },
]

describe('Render subscribe', () => {
  it('Render with a correct menu', async () => {
    mockAxios.onGet().replyOnce(200, cards)

    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Subscribe {...{ match: { params: { id: 1 } } }} />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let paySubTitle = await rendered.findByText('Pagar suscripción de bar')
    expect(paySubTitle).toBeInTheDocument()
  })

  it('Redirect if user has no cards', async () => {
    mockAxios.onGet().replyOnce(200, [])

    render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Subscribe {...{ match: { params: { id: 1 } } }} />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    expect(mockHistoryPush).toHaveBeenCalledWith({"pathname": "/payments/add-card", "state": {"next": "/payments/subscribe/1"}})
  })

  it('Press payment button', async () => {
    mockAxios.onGet().replyOnce(200, [])
    mockAxios.onPost().replyOnce(204, {})

    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Subscribe {...{ match: { params: { id: 1 } } }} />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let button = await rendered.findByText('Siguiente')
    fireEvent.click(button)

    let promise2 = new Promise((r) => setTimeout(r, 250))
    await act(() => promise2)

    expect(mockHistoryPush).toHaveBeenCalledWith('/payments/subscriptions')
  })

  it('Press payment button', async () => {
    mockAxios.onGet().replyOnce(200, [])
    mockAxios.onPost().replyOnce(400, {})

    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Subscribe {...{ match: { params: { id: 1 } } }} />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let button = await rendered.findByText('Siguiente')
    fireEvent.click(button)

    let promise2 = new Promise((r) => setTimeout(r, 250))
    await act(() => promise2)

    expect(mockHistoryPush).toHaveBeenCalledWith('/pageNotFound')
  })
})
