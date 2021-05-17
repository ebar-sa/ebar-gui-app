import React from 'react';
import { Router } from 'react-router-dom';
import {act, fireEvent, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Bar from '../pages/Bar';
import Context, {UserContextProvider} from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {username: "test-owner",
    email: "test@owner.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const wrongAuth = {username: "test-owner2",
    email: "test2@owner.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const bar = {
    "id": 1,
    "name": "Burger Food Porn",
    "description": "El templo de la hamburguesa.",
    "contact": "burgerfoodsevilla@gmail.com",
    "location": "Avenida de Finlandia, 24, Sevilla",
    "openingTime": "1970-01-01T13:00:00.000+00:00",
    "closingTime": "1970-01-01T22:30:00.000+00:00",
    "images": [
        {
            "id": 1,
            "fileName": "prueba",
            "fileType": "image/png",
            "data": "iVBORw0KGgoAAAANS",
            "new": false
        },
        {
            "id": 2,
            "fileName": "prueba2",
            "fileType": "image/png",
            "data": "FHEjdfhdfe34hfFHSDFJ",
            "new": false
        }
    ],
    "tables": 1,
    "freeTables": 1,
    "owner": "test-owner"
}

const barTable = {
    "id": 1,
    "name": "Mesa",
    "token": "abcdef",
    "free": false,
    "seats": 4
}

describe('Render test suite', () => {
    it('Render with a correct bar', async () => {

        mockAxios.onGet("/bar/1").replyOnce(200, bar)
        mockAxios.onGet("/tables/tableClient/test-owner").reply(200, barTable)
        window.localStorage.setItem("user",JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <Bar {...{match: {params: {barId: 1}}}}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 2000));
        await act(() => promise)

        let title = await rendered.findByText('Burger Food Porn')
        let description = await rendered.findByText('El templo de la hamburguesa.')
        let location = await rendered.findByText('Avenida de Finlandia, 24, Sevilla')

        expect(title).toBeInTheDocument()
        expect(description).toBeInTheDocument()
        expect(location).toBeInTheDocument()
    })

    it('Delete an image', async () => {

        mockAxios.onGet().replyOnce(200, bar)
        mockAxios.onDelete().replyOnce(204)

        window.localStorage.setItem("user",JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <Bar {...{match: {params: {barId: 1}}}}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let edit = await rendered.queryByText('Editar')
        let image1 = await rendered.findByAltText('')
        let deleteIm = await rendered.findByText('Eliminar')
        expect(edit).toBeInTheDocument()
        expect(image1.src).toBe("data:image/png;base64,iVBORw0KGgoAAAANS")
        expect(deleteIm).toBeInTheDocument()

        fireEvent.click(deleteIm, { button: 0 })
        let acceptDelete = await rendered.findByText('Aceptar')
        expect(acceptDelete).toBeVisible()

        fireEvent.click(acceptDelete, { button: 0 })
        let image2 = await rendered.findByAltText("")
        expect(image2.src).toBe("data:image/png;base64,FHEjdfhdfe34hfFHSDFJ")
    })

    it('Use carousel to pass images', async () => {

        mockAxios.onGet().replyOnce(200, bar)
        window.localStorage.setItem("user",JSON.stringify(auth));

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <Bar {...{match: {params: {barId: 1}}}}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let arrowLeft = await rendered.container.querySelector("#arrow-left")
        let arrowRight = await rendered.container.querySelector("#arrow-right")
        let image1 = await rendered.findByAltText('')

        expect(arrowLeft).toBeInTheDocument()
        expect(arrowRight).toBeInTheDocument()
        expect(image1.src).toBe("data:image/png;base64,iVBORw0KGgoAAAANS")

        fireEvent.click(arrowLeft, { button: 0 })
        let image2 = await rendered.findByAltText("")
        expect(image2.src).toBe("data:image/png;base64,FHEjdfhdfe34hfFHSDFJ")


        fireEvent.click(arrowRight, { button: 0 })
        let image3 = await rendered.findByAltText("")
        expect(image3.src).toBe("data:image/png;base64,iVBORw0KGgoAAAANS")
    })

    it('Delete and edit button does not appear to wrong owner', async () => {

        window.localStorage.setItem("user",JSON.stringify(wrongAuth))

        mockAxios.onGet("/bar/1").replyOnce(200, bar)
        mockAxios.onGet("/tables/tableClient/test-owner2").reply(200, barTable)

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <Bar {...{match: {params: {barId: 1}}}}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let image1 = await rendered.findByAltText('')
        let deleteIm = await rendered.queryByText('Eliminar')
        let edit = await rendered.queryByText('Editar')
        expect(image1.src).toBe("data:image/png;base64,iVBORw0KGgoAAAANS")
        expect(deleteIm).not.toBeInTheDocument()
        expect(edit).not.toBeInTheDocument()
    })

});