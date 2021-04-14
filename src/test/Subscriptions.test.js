import React from 'react'
import { Router } from 'react-router-dom'
import { act, fireEvent, render } from '@testing-library/react'

import { createMemoryHistory } from 'history'
import MockAdapter from 'axios-mock-adapter'

import Context from '../context/UserContext'
import http from '../http-common'
import Subscriptions from '../pages/Subscriptions'

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

const auth = {
  username: 'test-user',
  email: 'test@user.com',
  roles: ['ROLE_OWNER'],
  tokenType: 'Bearer',
  accessToken:
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg',
}

const subscriptions = [
  {
    bar_name: 'My bar name',
    bar_id: 1,
    period_end: 100000,
    status: 'active',
    cancel_at_period_end: false,
  },
]

const cards = [
  {
    brand: 'visa',
    last4: '4444',
    default: false,
    token: 'card_token',
  },
]

describe('Render subscriptions', () => {
  it('Render with a data', async () => {
    mockAxios.onGet().replyOnce(200, cards)
    mockAxios.onGet().replyOnce(200, subscriptions)

    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Subscriptions />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let barTitle = await rendered.findByText(subscriptions[0].bar_name)
    let last4 = await rendered.findByText('**** **** **** ' + cards[0].last4)

    expect(barTitle).toBeInTheDocument()
    expect(last4).toBeInTheDocument()
  })

  it('Remove card', async () => {
    mockAxios.onGet().replyOnce(200, cards)
    mockAxios.onGet().replyOnce(200, subscriptions)
    mockAxios.onPost().replyOnce(200, {})

    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Subscriptions />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let barTitle = await rendered.findByText(subscriptions[0].bar_name)
    let last4 = await rendered.findByText('**** **** **** ' + cards[0].last4)

    expect(barTitle).toBeInTheDocument()
    expect(last4).toBeInTheDocument()

    let removeButtonCount = await rendered.findAllByText('ELIMINAR')
    expect(removeButtonCount.length).toBe(1)

    let removeButton = await rendered.findByText('ELIMINAR')
    fireEvent.click(removeButton)

    await act(() => promise)

    let removeButtonsAfterDelete = await rendered.queryByText('ELIMINAR')
    expect(removeButtonsAfterDelete).toBe(null)
  })

  it('Try set as default', async () => {
    mockAxios.onGet().replyOnce(200, cards)
    mockAxios.onGet().replyOnce(200, subscriptions)
    mockAxios.onPost().replyOnce(200, {})

    let rendered = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Subscriptions />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let defaultButton = await rendered.findByText('ELEGIR COMO PREFERIDA')
    fireEvent.click(defaultButton)

    await act(() => promise)

    defaultButton = await rendered.queryByText('ELEGIR COMO PREFERIDA')
    expect(defaultButton).not.toBeInTheDocument()
  })
})
