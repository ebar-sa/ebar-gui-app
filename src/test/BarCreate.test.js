import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import CreateBar from '../pages/BarCreate';
import Context, {UserContextProvider} from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

const auth = {
    username: "test-owner",
    email: "test@owner.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg",
    braintreeMerchantId: "merchantId",
    braintreePublicKey: "publicKey",
    braintreePrivateKey: "privateKey"
}


describe("BarCreate test suite", () => {

    it("BarCreate render form successfully", async () => {

        window.sessionStorage.setItem("user", JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <CreateBar />
                </Router>
            </UserContextProvider>
        )

        let name = await rendered.findByText("Nombre")
        let description = await rendered.findByText("Descripción")
        let contact = await rendered.findByText("Contacto")
        let location = await rendered.findByText("Dirección")
        let openingTime = await rendered.findByText("Hora de apertura")
        let closingTime = await rendered.findByText("Hora de cierre")
        let upload = await rendered.findByText("Subir imágenes")
        let submit = await rendered.findByText("Enviar")

        expect(name).toBeInTheDocument()
        expect(description).toBeInTheDocument()
        expect(contact).toBeInTheDocument()
        expect(location).toBeInTheDocument()
        expect(openingTime).toBeInTheDocument()
        expect(closingTime).toBeInTheDocument()
        expect(upload).toBeInTheDocument()
        expect(submit).toBeInTheDocument()

    })

    it("Fill the form with valid values", async () => {

        window.sessionStorage.setItem("user", JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <CreateBar />
                </Router>
            </UserContextProvider>
        )

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'Burger Food Porn' } })
        expect(name.value).toBe('Burger Food Porn')

        let description = await rendered.container.querySelector("#description")
        fireEvent.change(description, { target: { value: 'El templo de la hamburguesa.' } })
        expect(description.value).toBe('El templo de la hamburguesa.')

        let contact = await rendered.getByRole('textbox', { name: /Contacto/i })
        fireEvent.change(contact, { target: { value: 'burgerfoodsevilla@gmail.com' } })
        expect(contact.value).toBe('burgerfoodsevilla@gmail.com')

        let location = await rendered.getByRole('textbox', { name: /Dirección/i })
        fireEvent.change(location, { target: { value: 'Avenida de Finlandia, 24, Sevilla' } })
        expect(location.value).toBe('Avenida de Finlandia, 24, Sevilla')

        let openingTime = await rendered.getByRole('textbox', { name: /Hora de apertura/i })
        fireEvent.change(openingTime, { target: { value: '13:30' } })
        expect(openingTime.value).toBe('13:30')

        let closingTime = await rendered.getByRole('textbox', { name: /Hora de cierre/i })
        fireEvent.change(closingTime, { target: { value: '22:30' } })
        expect(closingTime.value).toBe('22:30')

    })

    it("Fill the form with incorrect values", async () => {

        window.sessionStorage.setItem("user", JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <CreateBar />
                </Router>
            </UserContextProvider>
        )

        let openingTime = await rendered.getByRole('textbox', { name: /Hora de apertura/i })
        fireEvent.change(openingTime, { target: { value: '' } })
        expect(openingTime.value).toBe('')

        let errorTime = await rendered.findByText('La hora no es válida')
        expect(errorTime).toBeInTheDocument()

        let closingTime = await rendered.getByRole('textbox', { name: /Hora de cierre/i })
        fireEvent.change(closingTime, { target: { value: '' } })
        expect(closingTime.value).toBe('')
        expect(errorTime).toBeInTheDocument()

        fireEvent.change(openingTime, { target: { value: '13:30' } })
        fireEvent.change(openingTime, { target: { value: '22:30' } })

    })

    it("Correct submit", async () => {

        window.sessionStorage.setItem("user", JSON.stringify(auth))
        mockAxios.onPost().replyOnce(201, {}, {"location": "/bares/1"})

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <CreateBar history={history}/>
                </Router>
            </UserContextProvider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'Burger Food Porn' } })

        let description = await rendered.container.querySelector("#description")
        fireEvent.change(description, { target: { value: 'El templo de la hamburguesa.' } })

        let contact = await rendered.getByRole('textbox', { name: /Contacto/i })
        fireEvent.change(contact, { target: { value: 'burgerfoodsevilla@gmail.com' } })

        let location = await rendered.getByRole('textbox', { name: /Dirección/i })
        fireEvent.change(location, { target: { value: 'Avenida de Finlandia, 24, Sevilla' } })

        let openingTime = await rendered.getByRole('textbox', { name: /Hora de apertura/i })
        fireEvent.change(openingTime, { target: { value: '13:30' } })

        let closingTime = await rendered.getByRole('textbox', { name: /Hora de cierre/i })
        fireEvent.change(closingTime, { target: { value: '22:30' } })

        let send = await rendered.getByRole('button', { name: /Enviar/i })

        await act(async () => {
            fireEvent.click(send)
        })
        let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
        expect(errorSubmit).not.toBeInTheDocument()
    })

    it("Incorrect submit", async () => {
        window.sessionStorage.setItem("user", JSON.stringify(auth))
        mockAxios.onPost().replyOnce(201)

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <CreateBar history={history}/>
                </Router>
            </UserContextProvider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: '' } })

        let description = await rendered.container.querySelector("#description")
        fireEvent.change(description, { target: { value: '' } })

        let contact = await rendered.getByRole('textbox', { name: /Contacto/i })
        fireEvent.change(contact, { target: { value: '' } })

        let location = await rendered.getByRole('textbox', { name: /Dirección/i })
        fireEvent.change(location, { target: { value: '' } })

        let openingTime = await rendered.getByRole('textbox', { name: /Hora de apertura/i })
        fireEvent.change(openingTime, { target: { value: '' } })

        let closingTime = await rendered.getByRole('textbox', { name: /Hora de cierre/i })
        fireEvent.change(closingTime, { target: { value: '' } })

        let submit = await rendered.getByRole('button', { name: /Enviar/i })

        await act(async () => {
            fireEvent.click(submit)
        })

        let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
        expect(errorSubmit).toBeInTheDocument()
    })

    it("Add images to form", async () => {

        window.sessionStorage.setItem("user", JSON.stringify(auth))

        var file1 = new File(["foo"], "foo.png", {
            type: "image/png",
        });

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <CreateBar history={history}/>
                </Router>
            </UserContextProvider>
        )

        let input = rendered.getByTestId("prueba")
        expect(input).toBeInTheDocument()

        await userEvent.upload(input, file1)

        let promise = new Promise(r => setTimeout(r, 2000));
        await act(() => promise)

        let deleteImg = await rendered.getByRole('button', { name: /Eliminar/i })
        expect(deleteImg).toBeInTheDocument()

    })


})