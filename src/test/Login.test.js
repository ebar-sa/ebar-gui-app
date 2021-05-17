import React from 'react';
import {Router} from 'react-router-dom';
import {act, fireEvent, render, screen} from "@testing-library/react";

import {createMemoryHistory} from 'history';
import MockAdapter from 'axios-mock-adapter';

import Context from '../context/UserContext';
import http from '../http-common';
import Login from '../pages/Login';

const badAuth = {}
const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const {getComputedStyle} = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

const auth = {
    "username": "dani11",
    "password": "dani1234",
    "firstName": "dani",
    "lastName": "nose",
    "email": "test3@admin.com",
    "roles": [
        "ROLE_CLIENT"
    ]
}

describe('Login test suite', () => {

    it('Render login', async () => {

        let rendered = render(
            <Context.Provider value={{badAuth, setAuth}}>
                <Router history={history}>
                    <Login/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let signin = await rendered.findAllByText('Iniciar sesión')
        let username = await rendered.findByText("Nombre de usuario")
        let password = await rendered.findByText("Contraseña")

        expect(signin[0]).toBeInTheDocument()
        expect(username).toBeInTheDocument()
        expect(password).toBeInTheDocument()
    })

    it("Field change check", async () => {

        let rendered = render(
            <Context.Provider value={{badAuth, setAuth}}>
                <Router history={history}>
                    <Login/>
                </Router>
            </Context.Provider>
        )

        let username = await rendered.getByRole('textbox', {name: /Nombre de usuario/i})
        fireEvent.change(username, {target: {value: 'testusername'}})
        expect(username.value).toBe('testusername')

        let password = await rendered.getByLabelText(/Contraseña/i)
        fireEvent.change(password, {target: {value: 'password1234'}})
        expect(password.value).toBe('password1234')

    })

    it("Correct login submit", async () => {

        mockAxios.onPost().replyOnce(200, {})

        let rendered = render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history}>
                    <Login history={history}/>
                </Router>
            </Context.Provider>
        )

        let username = await rendered.getByRole('textbox', { name: /Nombre de usuario/i })
        fireEvent.change(username, { target: { value: 'dani11' } })
        expect(username.value).toBe('dani11')

        let password = await rendered.getByLabelText(/Contraseña/i)
        fireEvent.change(password, { target: { value: 'dani1234' } })
        expect(password.value).toBe('dani1234')

        let submit = await rendered.getByRole('button', { name: /Iniciar sesión/i })

        await act(async () => {
            fireEvent.click(submit)
        })

    })

    
    it("Incorrect submit", async () => {
        mockAxios.onPost().replyOnce(200)

        let rendered = render(
            <Context.Provider value={{badAuth, setAuth}}>
                <Router history={history}>
                    <Login history={history}/>
                </Router>
            </Context.Provider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let username = await rendered.getByRole('textbox', {name: /Nombre de usuario/i})
        fireEvent.change(username, {target: {value: ''}})

        let password = await rendered.getByLabelText(/Contraseña/i)
        fireEvent.change(password, {target: {value: ''}})

        let submit = await rendered.getByRole('button', {name: /Iniciar sesión/i})

        await act(async () => {
            fireEvent.click(submit)
        })

        let errors = await rendered.findAllByText('Este campo es obligatorio')

        expect(errors[0]).toBeInTheDocument()
        expect(errors[1]).toBeInTheDocument()
    })

});
