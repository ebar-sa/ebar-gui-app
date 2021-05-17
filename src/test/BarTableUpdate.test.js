import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';
import Context from '../context/UserContext';
import http from '../http-common';
import BarTableUpdate from '../pages/BarTableCRUD/BarTableUpdate';

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
        "name": "Mesa Test",
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


function renderCreateFormAdmin(auth) {
    return render(
        <Context.Provider value={{auth, setAuth}}>
            <Router history={history} >
                <BarTableUpdate {...{match: {params: {id: 1, idBar:1}}}}/>
            </Router>
        </Context.Provider>
    )
}


describe('Render test UpdateBarTable ', () => {

    it('Render with a correct BarTable Form', async () => {
        mockAxios.onGet().replyOnce(200,detailsDataLibre);
        let rendered = renderCreateFormAdmin(auth)

        let title = await rendered.findByText('Editar Mesa');
        let enviar = await rendered.findByText('Enviar');
        let volver = await rendered.findByText('Volver');
        let name = await rendered.getByDisplayValue('Mesa Test');
        let seats = await rendered.getByDisplayValue('5');
        
        expect(title).toBeInTheDocument();
        expect(enviar).toBeInTheDocument();
        expect(volver).toBeInTheDocument();
        expect(name).toBeInTheDocument();
        expect(seats).toBeInTheDocument();
        

        })

        it('Fields with the correct options', async () => {
            
            mockAxios.onGet().replyOnce(200,detailsDataLibre);
            let rendered = renderCreateFormAdmin(auth);
            let promise = new Promise(r => setTimeout(r, 350));
            await act(() => promise)
            let name = await rendered.getByRole('textbox', {name: /Nombre/i})
            fireEvent.change(name, {target : {value: 'Mesa Test 2'}})
            expect(name.value).toBe('Mesa Test 2');

            let seats = await rendered.getByLabelText('Sillas')
            fireEvent.change(seats, {target : {value: 6}})
            expect(seats.value).toBe('6');

        })

        
        it('Correct Submit to update a BarTable', async () => {
            mockAxios.onGet().replyOnce(200,detailsDataLibre)
            mockAxios.onPost().replyOnce(201);

            let rendered = renderCreateFormAdmin(auth);
            
            let promise = new Promise(r => setTimeout(r, 250));
            await act(() => promise)

            let name = await rendered.getByRole('textbox', {name: /Nombre/i})
            fireEvent.change(name, {target : {value: 'Mesa Test 3'}})        

            let seats = await rendered.getByLabelText('Sillas')
            fireEvent.change(seats, {target : {value: 6}})

            let send = await rendered.getByRole('button', {name: /Enviar/i})

            await act(async () => {
                fireEvent.click(send)
            })
        })
        it('Incorrect Submit to update a BarTable', async () => {
            mockAxios.onGet().replyOnce(200,detailsDataLibre)
            mockAxios.onPost().replyOnce(201);

            let rendered = renderCreateFormAdmin(auth);
            
            let promise = new Promise(r => setTimeout(r, 250));
            await act(() => promise)

            let name = await rendered.getByRole('textbox', {name: /Nombre/i})
            fireEvent.change(name, {target : {value: ''}})

            let seats = await rendered.getByLabelText('Sillas')
            fireEvent.change(seats, {target : {value: ''}})

            let send = await rendered.getByRole('button', {name: /Enviar/i})

            await act(async () => {
                fireEvent.click(send)
            })
            let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
            expect(errorSubmit).toBeInTheDocument()
        })
        it('Volver a la página anterior', async () => {
            mockAxios.onGet().replyOnce(200,detailsDataLibre)
            mockAxios.onPost().replyOnce(201);

            let rendered = renderCreateFormAdmin(auth);
                        
            let promise = new Promise(r => setTimeout(r, 250));
            await act(() => promise)
            let volver = await rendered.getByRole('button', { name: /Volver/i })

            fireEvent.click(volver);
        })
    });
