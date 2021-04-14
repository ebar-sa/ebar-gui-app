import React from 'react'
import { Router } from 'react-router-dom'
import { act, fireEvent, render } from '@testing-library/react'

import { createMemoryHistory } from 'history'
import MockAdapter from 'axios-mock-adapter'

import Context from '../context/UserContext'
import http from '../http-common'
import Subscribe from '../pages/Subscribe'
import Pricing from '../components/Pricing'

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

describe('Render subscribe', () => {
  it('Render with a correct menu', async () => {
    const { findByText } = render(
      <Context.Provider value={{ auth, setAuth }}>
        <Router history={history}>
          <Pricing />
        </Router>
      </Context.Provider>
    )

    let promise = new Promise((r) => setTimeout(r, 250))
    await act(() => promise)

    let price = await findByText('20 €')
    expect(price).toBeInTheDocument()
  })
})
