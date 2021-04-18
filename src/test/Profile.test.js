import React from 'react';
import { Router } from 'react-router-dom';
import { act, render } from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Context from '../context/UserContext';
import http from '../http-common';
import Profile from '../pages/Profile';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

describe('Render test suite', () => {
    it('Render profile', async () => {

        mockAxios.onPost().replyOnce(200, auth)

        let rendered = render(
            <Context.Provider value={{ auth, setAuth }} >
                <Router history={history} >
                    <Profile />
                </Router>
            </Context.Provider >)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let user = await rendered.findByTestId('username')

        expect(user).toBeInTheDocument()
    })
});
