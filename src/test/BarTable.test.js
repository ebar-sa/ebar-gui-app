import React from 'react';
import { Router } from 'react-router-dom';
import {act, fireEvent, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Context from '../context/UserContext';
import http from '../http-common';
import Mesas from "../pages/Mesas";

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_EMPLOYEE"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const tableList = [
    {
        "id": 20,
        "name": "mesa1",
        "free": true,
        "available": true,
        "token": "ihv-57f"
    },

    {
        "id": 21,
        "name": "mesa2",
        "free": true,
        "available": false,
        "token": "ihv-58f"
    }
]

describe('Render test suite', () => {
    it('Render with a correct list of tables', async () => {

        mockAxios.onGet().replyOnce(200, tableList)
        window.sessionStorage.setItem('user',JSON.stringify(auth));
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <Mesas {...{ match: { params: { idBar: 1 } }, history: { location: { state: {} } } }}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name1 = await rendered.findByText('mesa1')

        expect(name1).toBeInTheDocument()
    })

    it('Render with a correct enable BarTable', async () => {
        mockAxios.onGet().replyOnce(200, tableList)
        window.sessionStorage.setItem('user',JSON.stringify(auth));
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <Mesas {...{ match: { params: { idBar: 1 } }, history: { location: { state: {} } } }}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let botonDeshabilitar = await rendered.findByText('Deshabilitar Mesa')

        expect(botonDeshabilitar).toBeInTheDocument()
    })

    it('Render with a correct disable BarTable', async () => {
        mockAxios.onGet().replyOnce(200, tableList)
        window.sessionStorage.setItem('user',JSON.stringify(auth));
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <Mesas {...{ match: { params: { idBar: 1 } }, history: { location: { state: {} } } }}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let botonHabilitar = await rendered.findByText('Habilitar Mesa')

        expect(botonHabilitar).toBeInTheDocument()
    })

    it('Render with a correct disable BarTable with button', async () => {
        mockAxios.onGet().replyOnce(200, tableList)
        window.sessionStorage.setItem("user",JSON.stringify(auth));
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <Mesas {...{ match: { params: { idBar: 1 } }, history: { location: { state: {} } } }}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let disable = await rendered.getByRole('button', {name: /Deshabilitar Mesa/i})

        await act(async () => {
            fireEvent.click(disable)
        })

        expect(rendered.findByText('Habilitar Mesa'));
    })
    it('Render with a correct enable BarTable with button', async () => {
        mockAxios.onGet().replyOnce(200, tableList)
        window.sessionStorage.setItem("user",JSON.stringify(auth));
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <Mesas {...{ match: { params: { idBar: 1 } }, history: { location: { state: {} } } }}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let enable = await rendered.getAllByRole('button', {name: /Habilitar Mesa/i})

        await act(async () => {
            fireEvent.click(enable[0])
        })

        expect(rendered.findByText('Deshabilitar Mesa'));
    })
});