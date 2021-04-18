import React from 'react';
import { Router } from 'react-router-dom';
import {act, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import MenuAdmin from '../components/menu.component'
import Context from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
    }

const menu = {
    "id": 7,
    "items": [
        {
            "id": 10,
            "name": "Secreto Ibérico",
            "description": "descripcion",
            "rationType": "Racion",
            "price": 15.5,
            "category": "Carnes",
            "image": {
                "id": 1,
                "fileName": "name",
                "fileType": "type",
                "data": null,
                "new": false
            },
            "new": false
        }
    ]
}

const bar = {
    "id" : 1,
    "name" : "Bar de prueba",
    "descripción" : "Descripcion",
    "contact" : "987654321",
    "location" : "Sevilla",
    "owner" : auth,
    "menu" : menu
}

describe('Render test suite', () => {
    it('Render with a correct menu', async () => {

        mockAxios.onGet().replyOnce(200, menu)

        let rendered = render(
            <Context.Provider value={{ auth, setAuth }} >
                <Router history={history} >
                    <MenuAdmin {...{match: {params: {idBar: 1}}}} />
                </Router>
            </Context.Provider >)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        
        let name = await rendered.findByText('Secreto Ibérico')
        let description = await rendered.findByText('descripcion')
        let rationType = await rendered.findByText('Racion')
        let category = await rendered.findByText('Carnes')
        let back = await rendered.findByText("Volver")
        
        expect(name).toBeInTheDocument()
        expect(description).toBeInTheDocument()
        expect(rationType).toBeInTheDocument()
        expect(category).toBeInTheDocument()
        expect(back).toBeInTheDocument()
    },[10000])
});
