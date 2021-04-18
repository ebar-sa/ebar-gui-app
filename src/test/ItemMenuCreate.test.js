import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import CreateItem from '../pages/Menu/CreateItemMenu'
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

describe("ItemMenu test suite", () => {
    it("ItemMenu render form successfully", async () => {
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <CreateItem />
                </Router>
            </Context.Provider>
        )

        let name = await rendered.findByText("Nombre")
        let description = await rendered.findByText("Descripción")
        let category = await rendered.findByText("Categoria")
        let rationType = await rendered.findByText("Cantidad")
        let price = await rendered.findByText("Precio")
        let upload = await rendered.findByText("Subir imágenes")
        let submit = await rendered.findByText("Enviar")
        let back = await rendered.findByText("Volver")

        expect(name).toBeInTheDocument()
        expect(description).toBeInTheDocument()
        expect(category).toBeInTheDocument()
        expect(rationType).toBeInTheDocument()
        expect(price).toBeInTheDocument()
        expect(upload).toBeInTheDocument()
        expect(submit).toBeInTheDocument()
        expect(back).toBeInTheDocument()

    })


    it("Fill the form with valid values", async () => {
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <CreateItem />
                </Router>
            </Context.Provider>
        )

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'Hamburguesa de Buey' } })
        expect(name.value).toBe('Hamburguesa de Buey')

        let description = await rendered.getByRole('textbox', { name: /Descripción/i })
        fireEvent.change(description, { target: { value: 'Hamburguesa de 200 gramos de Buey' } })
        expect(description.value).toBe('Hamburguesa de 200 gramos de Buey')

        let category = await rendered.getByRole('textbox', { name: /Categoria/i })
        fireEvent.change(category, { target: { value: 'Carnes' } })
        expect(category.value).toBe('Carnes')

        let rationType = await rendered.getByRole('textbox', { name: /Cantidad/i })
        fireEvent.change(rationType, { target: { value: 'Unidad' } })
        expect(rationType.value).toBe('Unidad')

        let price = await rendered.getByRole('textbox', { name: /Precio/i })
        fireEvent.change(price, { target: { value: '12.50' } })
        expect(price.value).toBe('12.50')

    })

    it("Correct submit", async () => {
        mockAxios.onPost().replyOnce(201, {}, {"location": "/bares/1/menu/itemMenu"})

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <CreateItem history={history}/>
                </Router>
            </Context.Provider>
        )

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'Hamburguesa de Buey' } })

        let description = await rendered.getByRole('textbox', { name: /Descripción/i })
        fireEvent.change(description, { target: { value: 'Hamburguesa de 200 gramos de Buey' } })

        let category = await rendered.getByRole('textbox', { name: /Categoria/i })
        fireEvent.change(category, { target: { value: 'Carnes' } })

        let rationType = await rendered.getByRole('textbox', { name: /Cantidad/i })
        fireEvent.change(rationType, { target: { value: 'Unidad' } })

        let price = await rendered.getByRole('textbox', { name: /Precio/i })
        fireEvent.change(price, { target: { value: '12.50' } })

        let send = await rendered.getByRole('button', { name: /Enviar/i })

        await act(async () => {
            fireEvent.click(send)
        })
        let errorSubmit = await rendered.queryByText('El precio puede contener hasta 2 decimales')
        expect(errorSubmit).not.toBeInTheDocument()
    })

    it("Incorrect submit", async () => {
        mockAxios.onPost().replyOnce(201)
        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <CreateItem history={history}/>
                </Router>
            </Context.Provider>
        )
            let promise = new Promise(r => setTimeout(r, 250));
            await act(() => promise)

            let name = await rendered.getByRole('textbox', { name: /Nombre/i })
            fireEvent.change(name, { target: { value: '' } })

            let description = await rendered.getByRole('textbox', { name: /Descripción/i })
            fireEvent.change(description, { target: { value: '' } })

            let category = await rendered.getByRole('textbox', { name: /Categoria/i })
            fireEvent.change(category, { target: { value: '' } })

            let rationType = await rendered.getByRole('textbox', { name: /Cantidad/i })
            fireEvent.change(rationType, { target: { value: '' } })

            let price = await rendered.getByRole('textbox', { name: /Precio/i })
            fireEvent.change(price, { target: { value: '3.123' } })

            let submit = await rendered.getByRole('button', { name: /Enviar/i })

            await act(async () => {
                fireEvent.click(submit)
            })

            let errorName = await rendered.queryByText('El nombre del item tiene que rellenarse')
            expect(errorName).toBeInTheDocument()

            let errorCategory = await rendered.queryByText('La categoría del item tiene que rellenarse')
            expect(errorCategory).toBeInTheDocument()

            let errorRationType = await rendered.queryByText('La cantidad (ud, media ración, ración...) del item tiene que rellenarse')
            expect(errorRationType).toBeInTheDocument()

            let errorPrice = await rendered.queryByText('El precio puede contener hasta 2 decimales')
            expect(errorPrice).toBeInTheDocument()
        })

})