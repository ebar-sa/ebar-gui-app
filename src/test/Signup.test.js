import React from 'react';
import {Route, Router} from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";

import {createMemoryHistory} from 'history';
import MockAdapter from 'axios-mock-adapter';

import SignUp from '../pages/Signup';
import Context from '../context/UserContext';
import http from '../http-common';

const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const badAuth = {}
const setAuth = jest.fn()

const {getComputedStyle} = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);


describe("SignUp test suite", () => {

    it("SignUp render form successfully", async () => {

        let rendered = render(
            <Context.Provider value={{badAuth, setAuth}}>
                <Router history={history}>
                    <SignUp history={history}/>
                </Router>
            </Context.Provider>
        )

        let username = await rendered.findByText("Nombre de usuario")
        let firstName = await rendered.findByText("Nombre")
        let lastName = await rendered.findByText("Apellido")
        let email = await rendered.findByText("Email")
        let phoneNumber = await rendered.findByText("Teléfono")
        let dni = await rendered.findAllByText('DNI')
        let password = await rendered.findByText("Contraseña")
        let serviceTerms = await rendered.findByText(/He leído y acepto/i)
        let submit = await rendered.findAllByText("Registrarse")

        expect(username).toBeInTheDocument()
        expect(firstName).toBeInTheDocument()
        expect(lastName).toBeInTheDocument()
        expect(email).toBeInTheDocument()
        expect(dni[0]).toBeInTheDocument()
        expect(phoneNumber).toBeInTheDocument()
        expect(password).toBeInTheDocument()
        expect(serviceTerms).toBeInTheDocument()
        expect(submit[0]).toBeInTheDocument()

    })

    it("Field change check", async () => {

        let rendered = render(
            <Context.Provider value={{badAuth, setAuth}}>
                <Router history={history}>
                    <SignUp history={history}/>
                </Router>
            </Context.Provider>
        )

        let username = await rendered.getByRole('textbox', {name: /Nombre de usuario/i})
        fireEvent.change(username, {target: {value: 'testusername'}})
        expect(username.value).toBe('testusername')

        let firstName = await rendered.getAllByRole('textbox', {name: /Nombre/i})
        fireEvent.change(firstName[1], {target: {value: 'Test'}})
        expect(firstName[1].value).toBe('Test')

        let lastName = await rendered.getByRole('textbox', {name: /Apellido/i})
        fireEvent.change(lastName, {target: {value: 'Last'}})
        expect(lastName.value).toBe('Last')

        let email = await rendered.getByRole('textbox', {name: /Email/i})
        fireEvent.change(email, {target: {value: 'test@mail.com'}})
        expect(email.value).toBe('test@mail.com')

        let dni = await rendered.getByRole('textbox', {name: /DNI/i})
        fireEvent.change(dni, {target: {value: '12345678A'}})
        expect(dni.value).toBe('12345678A')

        let phoneNumber = await rendered.getByRole('textbox', {name: /Teléfono/i})
        fireEvent.change(phoneNumber, {target: {value: '666111222'}})
        expect(phoneNumber.value).toBe('666111222')

        let password = await rendered.getByLabelText(/Contraseña/i)
        fireEvent.change(password, {target: {value: 'password1234'}})
        expect(password.value).toBe('password1234')

        let serviceTerms = await rendered.getByLabelText(/He leído y acepto/i)
        fireEvent.change(serviceTerms, {target: {checked: true}})
        expect(serviceTerms.checked).toBe(true)

    })

    it("Incorrect submit", async () => {
        mockAxios.onPost().replyOnce(200)

        let rendered = render(
            <Context.Provider value={{badAuth, setAuth}}>
                <Router history={history}>
                    <SignUp history={history}/>
                </Router>
            </Context.Provider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let username = await rendered.getByRole('textbox', {name: /Nombre de usuario/i})
        fireEvent.change(username, {target: {value: 'a'}})

        let firstName = await rendered.getAllByRole('textbox', {name: /Nombre/i})
        fireEvent.change(firstName[1], {target: {value: ''}})

        let lastName = await rendered.getByRole('textbox', {name: /Apellido/i})
        fireEvent.change(lastName, {target: {value: ''}})

        let email = await rendered.getByRole('textbox', {name: /Email/i})
        fireEvent.change(email, {target: {value: 'testmail.com'}})

        let dni = await rendered.getByRole('textbox', {name: /DNI/i})
        fireEvent.change(dni, {target: {value: '8A'}})

        let phoneNumber = await rendered.getByRole('textbox', {name: /Teléfono/i})
        fireEvent.change(phoneNumber, {target: {value: '+666111+222'}})

        let password = await rendered.getByLabelText(/Contraseña/i)
        fireEvent.change(password, {target: {value: 'pass'}})

        let serviceTerms = await rendered.getByLabelText(/He leído y acepto/i)
        fireEvent.change(serviceTerms, {target: {checked: false}})

        let submit = await rendered.getByRole('button', {name: /Registrarse/i})
        await act(async () => {
            fireEvent.click(submit)
        })

        let errorUsername = await rendered.findByText('El nombre de usuario debe tener más de 3 caracteres y menos de 20')
        let errorFirstName = await rendered.findByText('El nombre no puede estar vacío')
        let errorLastName = await rendered.findByText('El apellido no puede estar vacío')
        let errorEmail = await rendered.findByText('Se debe introducir un correo electrónico válido y no mayor de 50 caracteres')
        let errorDni = await rendered.findByText('El DNI introducido no es válido, debe tener 8 dígitos seguidos de una letra mayúscula')
        let errorPhoneNumber = await rendered.findByText('Se debe introducir un número de teléfono válido')
        let errorPassword = await rendered.findByText('La contraseña debe tener más de 6 caracteres y menos de 40')
        let errorServiceTerms = await rendered.findByText('Obligatorio')

        expect(errorUsername).toBeInTheDocument()
        expect(errorFirstName).toBeInTheDocument()
        expect(errorLastName).toBeInTheDocument()
        expect(errorEmail).toBeInTheDocument()
        expect(errorDni).toBeInTheDocument()
        expect(errorPhoneNumber).toBeInTheDocument()
        expect(errorPassword).toBeInTheDocument()
        expect(errorServiceTerms).toBeInTheDocument()
    })

    it("Correct submit", async () => {
        mockAxios.onPost().replyOnce(200, {message: '¡Usuario registrado correctamente!'})

        let rendered = render(
            <Context.Provider value={{badAuth, setAuth}}>
                <Router history={history}>
                    <SignUp history={history}/>
                    <Route path="/login">Iniciar sesión</Route>
                </Router>
            </Context.Provider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let username = await rendered.getByRole('textbox', {name: /Nombre de usuario/i})
        fireEvent.change(username, {target: {value: 'testusername'}})

        let firstName = await rendered.getAllByRole('textbox', {name: /Nombre/i})
        fireEvent.change(firstName[1], {target: {value: 'Test'}})

        let lastName = await rendered.getByRole('textbox', {name: /Apellido/i})
        fireEvent.change(lastName, {target: {value: 'Last'}})

        let email = await rendered.getByRole('textbox', {name: /Email/i})
        fireEvent.change(email, {target: {value: 'test@mail.com'}})

        let dni = await rendered.getByRole('textbox', {name: /DNI/i})
        fireEvent.change(dni, {target: {value: '12345678A'}})

        let phoneNumber = await rendered.getByRole('textbox', {name: /Teléfono/i})
        fireEvent.change(phoneNumber, {target: {value: '666111222'}})

        let password = await rendered.getByLabelText(/Contraseña/i)
        fireEvent.change(password, {target: {value: 'password1234'}})

        let serviceTerms = await rendered.getByLabelText(/He leído y acepto/i)
        fireEvent.click(serviceTerms)

        let send = await rendered.getByRole('button', {name: /Registrarse/i})
        await act(async () => {
            fireEvent.click(send)
        })

        expect(rendered.container).toHaveTextContent(/Iniciar sesión/)
    })

})