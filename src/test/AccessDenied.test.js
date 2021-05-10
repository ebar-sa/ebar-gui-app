import React from 'react';
import { Router } from 'react-router-dom';
import { act, render } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';
import userEvent from '@testing-library/user-event';
import AccessDenied from '../pages/AccessDenied';

const setAuth = jest.fn()
const history = createMemoryHistory()

const auth = {
    username: "test-owner",
    email: "test@owner.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg",
    braintreeMerchantId: '',
    braintreePublicKey: '',
    braintreePrivateKey: '',
}

describe('Access test suite', () => {

    it('Render access', async () => {

        let rendered = render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history}>
                    <AccessDenied/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let access = await rendered.findByText('No tienes acceso a esta parte. Cuidado con las acciones ilegales')
        let home = await rendered.findByText('Ir al inicio')
        expect(access).toBeInTheDocument()
        expect(home).toBeInTheDocument()
        userEvent.click(home)
    })
})