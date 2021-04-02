import React from 'react';
import { Router } from 'react-router-dom';
import {act, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import BarList from '../pages/BarList';
import Context from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const barList = [
    {
        "id": 1,
        "name": "Burger Food Porn",
        "capacity": "7/11"
    },
    {
        "id": 2,
        "name": "Bar Casa Paco",
        "capacity": "2/14"
    }
]

describe('Render test suite', () => {
    it('Render with a correct list of bars', async () => {

        mockAxios.onGet().replyOnce(200, barList)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title1 = await rendered.findByText('Burger Food Porn')
        let title2 = await rendered.findByText('Bar Casa Paco')
        let capacity1 = await rendered.findByText('Aforo: 7/11')
        let capacity2 = await rendered.findByText('Aforo: 2/14')

        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(capacity1).toBeInTheDocument()
        expect(capacity2).toBeInTheDocument()
    })

});