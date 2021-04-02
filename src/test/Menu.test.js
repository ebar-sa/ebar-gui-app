
import React from 'react';
import { Router } from 'react-router-dom';
import {act, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import UserMenuDetails from '../components/user-menu.component';
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

const menu = {
    "id": 1,
    "items":[
        {
        "id":1,
        "description":"descripcion",
        "name":"Ensaladilla",
        "price":'2.5',
        "ration_type":"RATION",
        "category_id":1,
        "image_id":1
     }
     ]
}

describe('Render test suite', () => {
    it('Render with a correct menu', async () => {

        mockAxios.onGet().replyOnce(200, menu)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <Menu {...{match: {params: {menuId: 1}}}}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title = await rendered.findByText('Ensaladilla')
        let description = await rendered.findByText('descripcion')
        let price = await rendered.findByText('2.5')

        expect(title).toBeInTheDocument()
        expect(description).toBeInTheDocument()
        expect(price).toBeInTheDocument()
    })

});