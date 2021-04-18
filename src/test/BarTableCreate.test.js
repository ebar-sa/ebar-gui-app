import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';
import Context from '../context/UserContext';
import http from '../http-common';
import BarTableCreate from '../pages/BarTableCRUD/createTable';

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
function renderCreateFormAdmin(auth) {
    return render(
        <Context.Provider value={{auth, setAuth}}>
            <Router history={history} >
                <BarTableCreate {...{match: {params: {id: 1}}}}/>
            </Router>
        </Context.Provider>
    )
}


describe('Render test CreateBarTable ', () => {
    
    it('Render with a correct BarTable Form', async () => {

        let rendered = renderCreateFormAdmin(auth)

        let title = await rendered.findByText('Creación de Mesa')
        let enviar = await rendered.findByText('Enviar')

        expect(title).toBeInTheDocument()
        expect(enviar).toBeInTheDocument()

        })

        it('Fields with the correct options', async () => {
            let rendered = renderCreateFormAdmin(auth);

            let name = await rendered.getByRole('textbox', {name: /Nombre/i})
            fireEvent.change(name, {target : {value: 'Mesa Test'}})
            expect(name.value).toBe('Mesa Test');

            // let seats = await rendered.getByRole('number', {seats: /Sillas/i})
            let seats = await rendered.getByLabelText('Sillas')
            fireEvent.change(seats, {target : {value: 6}})
            expect(seats.value).toBe('6');

        })

        
        it('Correct Submit to create a BarTable', async () => {
            mockAxios.onPost().replyOnce(201);

            let rendered = renderCreateFormAdmin(auth);

            
            let promise = new Promise(r => setTimeout(r, 250));
            await act(() => promise)

            let name = await rendered.getByRole('textbox', {name: /Nombre/i})
            fireEvent.change(name, {target : {value: 'Mesa Test'}})
            expect(name.value).toBe('Mesa Test');

            //let seats = await rendered.getByRole('number', {seats: /Sillas/i})
            let seats = await rendered.getByLabelText('Sillas')
            fireEvent.change(seats, {target : {value: 6}})
            expect(seats.value).toBe('6');

            let send = await rendered.getByRole('button', {name: /Enviar/i})

            await act(async () => {
                fireEvent.click(send)
            })
            let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
            expect(errorSubmit).not.toBeInTheDocument()
        })
        it('Incorrect Submit to create a BarTable', async () => {
            mockAxios.onPost().replyOnce(201);

            let rendered = renderCreateFormAdmin(auth);
            
            let promise = new Promise(r => setTimeout(r, 250));
            await act(() => promise)

            let name = await rendered.getByRole('textbox', {name: /Nombre/i})
            fireEvent.change(name, {target : {value: 'Mesa Test'}})

            let seats = await rendered.getByLabelText('Sillas')
            fireEvent.change(seats, {target : {value: ''}})

            let send = await rendered.getByRole('button', {name: /Enviar/i})

            await act(async () => {
                fireEvent.click(send)
            })
            let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
            expect(errorSubmit).toBeInTheDocument()
        })
        it('Incorrect Submit to create a BarTable', async () => {
            mockAxios.onPost().replyOnce(404);

            let rendered = renderCreateFormAdmin(auth);
            
            let promise = new Promise(r => setTimeout(r, 250));
            await act(() => promise)

            let name = await rendered.getByRole('textbox', {name: /Nombre/i})
            fireEvent.change(name, {target : {value: 'Mesa Test'}})

            let seats = await rendered.getByLabelText('Sillas')
            fireEvent.change(seats, {target : {value: ''}})

            let send = await rendered.getByRole('button', {name: /Enviar/i})

            await act(async () => {
                fireEvent.click(send)
            })
            let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
            expect(errorSubmit).toBeInTheDocument()
        })

    });
