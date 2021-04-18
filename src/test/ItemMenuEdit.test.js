import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import UpdateItemMenu from '../pages/Menu/EditItemMenu';
import Context from '../context/UserContext';
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
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const itemMenu = {
    "id": 1,
    "name": "Solomillo Ibérico",
    "description": "Carne ibérica",
    "category": "Carnes",
    "rationType": "Ración",
    "price": "15.5",
    "image": {
            "id": 1,
            "fileName": "prueba",
            "fileType": "image/png",
            "data": "iVBORw0KGgoAAAANS",
            "new": false
        }    
}

describe("ItemMenuUpdate test suite", () => {

    it("Render form correctly", async () => {
        mockAxios.onGet().replyOnce(200, itemMenu)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <UpdateItemMenu {...{match: {params: {idItemMenu: 1}}}} />
                </Router>
            </Context.Provider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name = await rendered.findByDisplayValue("Solomillo Ibérico")
        let description = await rendered.findByDisplayValue("Carne ibérica")
        let category = await rendered.findByDisplayValue("Carnes")
        let rationType = await rendered.findByDisplayValue("Ración")
        let price = await rendered.findByDisplayValue("15.5")
        let upload = await rendered.findByText("Subir imágenes")
        let submit = await rendered.findByText("Enviar")

        expect(name).toBeInTheDocument()
        expect(name.value).toBe("Solomillo Ibérico")
        expect(description).toBeInTheDocument()
        expect(description.value).toBe("Carne ibérica")
        expect(category).toBeInTheDocument()
        expect(category.value).toBe("Carnes")
        expect(rationType).toBeInTheDocument()
        expect(rationType.value).toBe("Ración")
        expect(price).toBeInTheDocument()
        expect(price.value).toBe("15.5")
        expect(upload).toBeInTheDocument()
        expect(submit).toBeInTheDocument()
    })

    it("Correct submit", async () => {

        mockAxios.onGet().replyOnce(200, itemMenu)
        mockAxios.onPut().replyOnce(200, itemMenu)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <UpdateItemMenu {...{match: {params: {idItemMenu: 1}}}} history={history}/>
                </Router>
            </Context.Provider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'Solomillo Ibérico' } })

        let description = await rendered.getByRole('textbox', { name: /Descripción/i })
        fireEvent.change(description, { target: { value: 'Carne ibérica' } })

        let category = await rendered.getByRole('textbox', { name: /Categoria/i })
        fireEvent.change(category, { target: { value: 'Carnes' } })

        let rationType = await rendered.getByRole('textbox', { name: /Cantidad/i })
        fireEvent.change(rationType, { target: { value: 'Ración' } })

        let price = await rendered.getByRole('textbox', { name: /Precio/i })
        fireEvent.change(price, { target: { value: '15.5' } })

        let send = await rendered.getByRole('button', { name: /Enviar/i })

        await act(async () => {
            fireEvent.click(send)
        })
        let errorSubmit = await rendered.queryByText('El precio puede contener hasta 2 decimales')
        expect(errorSubmit).not.toBeInTheDocument()
    })

    it("Incorrect submit", async () => {

        mockAxios.onGet().replyOnce(200, itemMenu)
        mockAxios.onPut().replyOnce(200, itemMenu)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <UpdateItemMenu {...{match: {params: {idItemMenu: 1}}}} history={history}/>
                </Router>
            </Context.Provider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: '' } })

        let description = await rendered.getByRole('textbox', { name: /Descripción/i })
        fireEvent.change(description, { target: { value: 'Carne ibérica' } })

        let category = await rendered.getByRole('textbox', { name: /Categoria/i })
        fireEvent.change(category, { target: { value: '' } })

        let rationType = await rendered.getByRole('textbox', { name: /Cantidad/i })
        fireEvent.change(rationType, { target: { value: '' } })

        let price = await rendered.getByRole('textbox', { name: /Precio/i })
        fireEvent.change(price, { target: { value: '15.521' } })

        let send = await rendered.getByRole('button', { name: /Enviar/i })

        await act(async () => {
            fireEvent.click(send)
        })

        let errorName = await rendered.queryByText('El nombre del item tiene que rellenarse')
        expect(errorName).toBeInTheDocument()

        let errorCategory = await rendered.queryByText('La categoría del item tiene que rellenarse')
        expect(errorCategory).toBeInTheDocument()

        let errorRationType = await rendered.queryByText('La cantidad (ud, media ración, ración...) del item tiene que rellenarse')
        expect(errorRationType).toBeInTheDocument()

        let errorPrice = await rendered.queryByText('El precio debe de incluir decimales')
        expect(errorPrice).toBeInTheDocument()
    })
})
