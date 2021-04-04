import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, queryByAttribute} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Context from '../context/UserContext';
import http from '../http-common';
import BarTableDetails from '../components/mesa-details.component';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_OWNER"],
    tokenType:"Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}
const detailsDataLibre = {
    0:{
        "id" : 1,
        "name": "Mesa 1",
        "token": "jdh-256", 
        "free": true,
        "seats": 5,
        "bar_id": null,
        "trabajador_id": null
    },
    1:{
        "id": 3,
        "items": [
        {
            "id": 10,
            "name": "Salmorejo",
            "description": "descripcion",
            "rationType": "RATION",
            "price": 5.5,
            "category": {
                "id": 1,
                "name": "picoteamos",
                "new": false
            },
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
    },
    2:{
        "id": 1,
        "itemBill": []
    }
}
const detailsDataTableOcupated = {    
    0:{
    "id" : 1,
    "name": "Mesa 1",
    "token": "jdh-256", 
    "free": false,
    "seats": 5,
    "bar_id": null,
    "trabajador_id": null
    },
    1:{
        "id": 3,
        "items": [
        {
            "id": 10,
            "name": "Salmorejo",
            "description": "descripcion",
            "rationType": "RATION",
            "price": 5.5,
            "category": {
                "id": 1,
                "name": "picoteamos",
                "new": false
            },
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
    },
    2:{
        "id": 1,
        "itemBill": [
        {
            "id": 1,
            "amount": 3,
            "itemMenu": {
                "id": 1,
                "name": "Ensaladilla",
                "description": "descripcion",
                "rationType": "RATION",
                "price": 2.5,
                "category": {
                    "id": 1,
                    "name": "picoteamos",
                    "new": false
                },
                "image": {
                    "id": 1,
                    "fileName": "name",
                    "fileType": "type",
                    "data": null,
                    "new": false
                },
                "new": false
            },
            "new": false
        }
        ]
    }
}
Object.defineProperty(window, "sessionStorage", {
    value: {
        getItem : jest.fn( () => null),
        setItem : jest.fn(() => null) 
    },
    writable:true
}); 
describe('Render test suite', () => {
    it('Render with a correct BarTable', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataLibre)
        window.sessionStorage.setItem("user",JSON.stringify(auth));
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <BarTableDetails {...{match: {params: {id: 1}}}}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)

        let name = await rendered.findByText('Mesa 1')
        let token = await rendered.findByText('jdh-256')
        let estadoMesa = await rendered.findByText('Libre')
        let mensajeMesaLibre = await rendered.findByText('La Mesa 1 se encuentra libre, ocupe la mesa para comenzar.')
        let botonOcupar = await rendered.findByText('Ocupar Manualmente')

        expect(name).toBeInTheDocument()
        expect(token).toBeInTheDocument()
        expect(estadoMesa).toBeInTheDocument()
        expect(mensajeMesaLibre).toBeInTheDocument()
        expect(botonOcupar).toBeInTheDocument()
        
    })
});

describe('Render test suite', () => {
    it('Render with a correct BarTable', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataTableOcupated)
        window.sessionStorage.setItem("user",JSON.stringify(auth));
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <BarTableDetails {...{match: {params: {id: 1}}}}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)

        let name = await rendered.findByText('Mesa 1')
        let token = await rendered.findByText('jdh-256')
        let estadoMesa = await rendered.findByText('Ocupada')
        let botonDesocupar = await rendered.findByText('Desocupar Manualmente')

        expect(name).toBeInTheDocument()
        expect(token).toBeInTheDocument()
        expect(estadoMesa).toBeInTheDocument()
        expect(botonDesocupar).toBeInTheDocument()

    })
});