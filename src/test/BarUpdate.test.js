import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import UpdateBar from '../pages/BarUpdate';
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

const wrongAuth = {
    username: "test-owner2",
    email: "test@owner2.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg",
    braintreeMerchantId: null,
    braintreePublicKey: null,
    braintreePrivateKey: null
}

const bar = {
    "id": 1,
    "name": "Burger Food Porn",
    "description": "El templo de la hamburguesa.",
    "contact": "burgerfoodsevilla@gmail.com",
    "location": "Avenida de Finlandia, 24, Sevilla",
    "openingTime": "1970-01-01T13:00:00.000+01:00",
    "closingTime": "1970-01-01T22:30:00.000+01:00",
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
    "freeTables": 1,
    "owner": "test-owner"
}

describe("BarUpdate test suite", () => {

    it("Render form correctly", async () => {

        window.localStorage.setItem("user", JSON.stringify(auth))
        mockAxios.onGet().replyOnce(200, bar)

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <UpdateBar {...{match: {params: {barId: 1}}}} />
                </Router>
            </UserContextProvider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name = await rendered.findByDisplayValue("Burger Food Porn")
        let description = await rendered.findByDisplayValue("El templo de la hamburguesa.")
        let contact = await rendered.findByDisplayValue("burgerfoodsevilla@gmail.com")
        let location = await rendered.findByDisplayValue("Avenida de Finlandia, 24, Sevilla")
        let upload = await rendered.findByText("Subir imágenes")
        let submit = await rendered.findByText("Enviar")

        expect(name).toBeInTheDocument()
        expect(name.value).toBe("Burger Food Porn")
        expect(description).toBeInTheDocument()
        expect(description.value).toBe("El templo de la hamburguesa.")
        expect(contact).toBeInTheDocument()
        expect(contact.value).toBe("burgerfoodsevilla@gmail.com")
        expect(location).toBeInTheDocument()
        expect(location.value).toBe("Avenida de Finlandia, 24, Sevilla")
        expect(upload).toBeInTheDocument()
        expect(submit).toBeInTheDocument()
    })

    it("404 error", async () => {
        window.localStorage.setItem("user", JSON.stringify(auth))
        const spy = jest.spyOn(history, 'push')
        mockAxios.onGet().replyOnce(404, bar)

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <UpdateBar {...{match: {params: {barId: 1}}}} />
                </Router>
            </UserContextProvider>
        )

        let promise = new Promise(r => setTimeout(r, 2000));
        await act(() => promise)

        expect(spy).toHaveBeenCalledTimes(1)

    })

    it("Try to update bar with wrong owner", async () => {

        const spy = jest.spyOn(history, 'push')
        mockAxios.onGet().replyOnce(200, bar)
        window.localStorage.setItem("user", JSON.stringify(wrongAuth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <UpdateBar {...{match: {params: {barId: 1}}}} />
                </Router>
            </UserContextProvider>
        )

        let promise = new Promise(r => setTimeout(r, 2000));
        await act(() => promise)

        expect(spy).toHaveBeenCalledTimes(1)

    })

    it("Correct submit", async () => {

        window.localStorage.setItem("user", JSON.stringify(auth))
        mockAxios.onGet().replyOnce(200, bar)
        mockAxios.onPut().replyOnce(200, bar)

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <UpdateBar {...{match: {params: {barId: 1}}}} history={history}/>
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
})