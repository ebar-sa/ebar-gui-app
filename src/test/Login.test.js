import React from 'react';
import { Router } from 'react-router-dom';
import { act, render } from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Context from '../context/UserContext';
import http from '../http-common';
import Login from '../pages/Login';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const badAuth = {}

describe('Render test suite', () => {
    it('Render login', async () => {

        mockAxios.onGet().replyOnce(200, {})

        let rendered = render(
            <Context.Provider value={{ badAuth, setAuth }} >
                <Router history={history} >
                    <Login />
                </Router>
            </Context.Provider >)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let signin = await rendered.findByText('Log in')

        expect(signin).toBeInTheDocument()
    })

});
