import React from 'react';
import {Router} from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";

import {createMemoryHistory} from 'history';
import MockAdapter from 'axios-mock-adapter';

import Context, {UserContextProvider} from '../context/UserContext';
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

const ownerAuth = {
    username: "test-owner",
    email: "test@owner.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg",
    braintreeMerchantId: '',
    braintreePublicKey: '',
    braintreePrivateKey: '',
}

describe('Profile test suite', () => {
    it('Render profile', async () => {

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history}>
                    <Profile history={history}/>
                </Router>
            </Context.Provider>)

        let username = await rendered.findByTestId('username')
        let dni = await rendered.findByText('DNI')
        let name = await rendered.findByText('Nombre')
        let firstName = await rendered.findByText('Apellidos')
        let email = await rendered.findAllByText('Email')
        let oldPass = await rendered.findAllByText('Contraseña')
        let newPass = await rendered.findAllByText('Nueva contraseña')
        let repeatPass = await rendered.findAllByText('Confirmar contraseña')
        let submit = await rendered.findByText('Actualizar')

        expect(username).toBeInTheDocument()
        expect(dni).toBeInTheDocument()
        expect(name).toBeInTheDocument()
        expect(firstName).toBeInTheDocument()
        expect(email[0]).toBeInTheDocument()
        expect(oldPass[0]).toBeInTheDocument()
        expect(newPass[0]).toBeInTheDocument()
        expect(repeatPass[0]).toBeInTheDocument()
        expect(submit).toBeInTheDocument()
    })

    it("Field change check", async () => {

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history}>
                    <Profile history={history}/>
                </Router>
            </Context.Provider>)

        let email = await rendered.getByRole('textbox', {name: /Email/i})
        fireEvent.change(email, {target: {value: 'test@mail.com'}})
        expect(email.value).toBe('test@mail.com')

        let oldpassword = await rendered.getByLabelText("Contraseña")
        fireEvent.change(oldpassword, {target: {value: 'password'}})
        expect(oldpassword.value).toBe('password')

        let newPassword = await rendered.getByLabelText("Nueva contraseña")
        fireEvent.change(newPassword, {target: {value: 'password1234'}})
        expect(newPassword.value).toBe('password1234')

        let confirmPass = await rendered.getByLabelText("Confirmar contraseña")
        fireEvent.change(confirmPass, {target: {value: 'password1234'}})
        expect(confirmPass.value).toBe('password1234')
    })

    it("Incorrect submit", async () => {
        mockAxios.onPost().replyOnce(200)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history}>
                    <Profile history={history}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let email = await rendered.getByRole('textbox', {name: /Email/i})
        fireEvent.change(email, {target: {value: 'testmail.com'}})

        let oldpassword = await rendered.getByLabelText("Contraseña")
        fireEvent.change(oldpassword, {target: {value: ''}})

        let newPassword = await rendered.getByLabelText("Nueva contraseña")
        fireEvent.change(newPassword, {target: {value: 'pass'}})

        let confirmPass = await rendered.getByLabelText("Confirmar contraseña")
        fireEvent.change(confirmPass, {target: {value: 'password1234'}})

        let submit = await rendered.getByRole('button', {name: /Actualizar/i})
        await act(async () => {
            fireEvent.click(submit)
        })

        let errorEmail = await rendered.findByText('Se debe introducir un correo electrónico válido y no mayor de 50 caracteres')
        let errorOldPassword = await rendered.findByText('La contraseña no puede estar vacia')
        let errorPassword = await rendered.findByText('La contraseña debe tener más de 6 caracteres y menos de 40')
        let errorConfirmPass = await rendered.findByText('Las contraseñas deben coincidir')

        expect(errorEmail).toBeInTheDocument()
        expect(errorOldPassword).toBeInTheDocument()
        expect(errorPassword).toBeInTheDocument()
        expect(errorConfirmPass).toBeInTheDocument()
    })

    it("Correct submit", async () => {
        mockAxios.onPost().replyOnce(200, {message: 'Datos actualizados correctamente.'})

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history}>
                    <Profile history={history}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let email = await rendered.getByRole('textbox', {name: /Email/i})
        fireEvent.change(email, {target: {value: 'test@mail.com'}})

        let oldpassword = await rendered.getByLabelText("Contraseña")
        fireEvent.change(oldpassword, {target: {value: 'password1234'}})

        let newPassword = await rendered.getByLabelText("Nueva contraseña")
        fireEvent.change(newPassword, {target: {value: 'newpass1234'}})

        let confirmPass = await rendered.getByLabelText("Confirmar contraseña")
        fireEvent.change(confirmPass, {target: {value: 'newpass1234'}})

        let submit = await rendered.getByRole('button', {name: /Actualizar/i})
        await act(async () => {
            fireEvent.click(submit)
        })

        let success = await rendered.findByText(/Datos actualizados correctamente/)

        expect(success).toBeInTheDocument()
    })

    it('Fill Braintree data form', async () => {
        window.sessionStorage.setItem("user", JSON.stringify(ownerAuth))
        mockAxios.onPatch().replyOnce(200, {message: 'Datos actualizados correctamente.'})

        let rendered = render(
            <UserContextProvider>
                <Router history={history}>
                    <Profile history={history}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let braintreeButton = await rendered.getByRole('button', {name: /Introducir credenciales de Braintree/i})
        fireEvent.click(braintreeButton)

        let braintreeDialog = await rendered.getByTestId("braintree-dialog")
        expect(braintreeDialog).toBeTruthy()

        let merchantId = await rendered.getByRole('textbox', { name: /Id de comerciante/i })
        fireEvent.change(merchantId, { target: { value: 'merchantId' } })

        let publicKey = await rendered.getByRole('textbox', { name: /Clave pública/i })
        fireEvent.change(publicKey, { target: { value: 'publicKey' } })

        let privateKey = await rendered.getByRole('textbox', { name: /Clave privada/i })
        fireEvent.change(privateKey, { target: { value: 'privateKey' } })

        let submit = await rendered.getByRole('button', {name: /Registrar claves/i})
        await act(async () => {
            fireEvent.click(submit)
        })

        let success = await rendered.findByText(/Datos actualizados correctamente/)
        expect(success).toBeInTheDocument()

    })
});

describe('Send email', () => {
    it('Render request data', async () => {

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history}>
                    <Profile/>
                </Router>
            </Context.Provider>)

        let request = await rendered.findByText('Solicitar datos de la cuenta')
        expect(request).toBeInTheDocument()
    })

    it('Click request data', async () => {

        jest.mock('emailjs-com', () => {
            return {
                send: () => new Promise({
                    status: 200,
                    text: "OK"
                })
            };
        });

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history}>
                    <Profile/>
                </Router>
            </Context.Provider>)

        let sendRequest = await rendered.queryByTestId("requestDataButton")
        await act(async () => {
            await fireEvent.click(sendRequest)
        })

        let dialog = await rendered.queryByTestId("acceptOrDeclineDialog")
        expect(dialog).toBeInTheDocument()

        let accept = await rendered.queryByTestId("acceptDialog")
        await act(async () => {
            await fireEvent.click(accept)
        })
    })
});