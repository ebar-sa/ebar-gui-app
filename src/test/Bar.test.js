import React from 'react';
import { Router } from 'react-router-dom';
import {act, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Bar from '../pages/Bar';
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

const bar = {
    "id": 1,
    "name": "Burger Food Porn",
    "description": "El templo de la hamburguesa.",
    "contact": "burgerfoodsevilla@gmail.com",
    "location": "Avenida de Finlandia, 24, Sevilla",
    "openingTime": "1970-01-01T13:00:00.000+00:00",
    "closingTime": "1970-01-01T22:30:00.000+00:00",
    "images": [
        {
            "id": 1,
            "fileName": "prueba",
            "fileType": "image/png",
            "data": "iVBORw0KGgoAAAANS",
            "new": false
        }
    ],
    "tables": 1,
    "freeTables": 1
}

describe('Render test suite', () => {
    it('Render with a correct bar', async () => {

        mockAxios.onGet().replyOnce(200, bar)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <Bar {...{match: {params: {barId: 1}}}}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title = await rendered.findByText('Burger Food Porn')
        let description = await rendered.findByText('El templo de la hamburguesa.')
        let location = await rendered.findByText('Avenida de Finlandia, 24, Sevilla')

        expect(title).toBeInTheDocument()
        expect(description).toBeInTheDocument()
        expect(location).toBeInTheDocument()
    })

});