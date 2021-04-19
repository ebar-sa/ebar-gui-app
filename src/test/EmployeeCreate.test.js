import React from 'react';
import { act, render, fireEvent } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import http from "../http-common";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';
import CreateEmployee from '../pages/EmployeeCreate';

// Hide warning
console.error = () => { }

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()
history.push = jest.fn();

const admin = {
    username: "test-admin",
    email: "test@admin.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LWFkbWluIiwiaWF0IjoxNjE3NDUwNzk0LCJleHAiOjE2MTc1MzcxOTR9.KhlzaCxWGb25NHgJ557N1L6ETwNdTOqrKJ1s4cnBG7L2rZFEWLnbhizLJ5LizHxUqGxqrps3NU-gx-l6FyozRg"
}
const barList = {
    "id": 1,
    "name": "Burger Food Porn",
    "capacity": "7/11",
    "owner":"test-admin",
    "employees": [{}]
}



function renderCreateEmployee(auth){
    return render(
        <Context.Provider value={{ auth, setAuth }}>
            <Router history={history}>
                <CreateEmployee {...{ match: { params: { idBar: 1 }}}} history={history} />
            </Router>
        </Context.Provider>
        )
}

describe('Testing create employee', () => {

    it('Render form with correct text admin', async () => {
        let rendered = renderCreateEmployee(admin)
        mockAxios.onGet().replyOnce(200, barList)

        let username = await rendered.findByText('Nombre de usuario')
        let firstName = await rendered.findByText('Nombre')
        let lastName = await rendered.findByText('Apellido')
        let email = await rendered.findByText('Email')
        let phoneNumber = await rendered.findByText('Telefono')
        let dni = await rendered.findAllByText('DNI')
        let password = await rendered.findByText('Contraseña')
        let send = await rendered.findByText('Crear')

        expect(username).toBeInTheDocument()
        expect(firstName).toBeInTheDocument()
        expect(lastName).toBeInTheDocument()
        expect(email).toBeInTheDocument()
        expect(phoneNumber).toBeInTheDocument()
        expect(password).toBeInTheDocument()
        expect(dni[0]).toBeInTheDocument()
        expect(send).toBeInTheDocument()

    })

    it('Correct submit', async () => {
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(201)

        let rendered = renderCreateEmployee(admin)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let username = await rendered.getByRole('textbox', { name: /Nombre de usuario/i })
        fireEvent.change(username, { target: { value: 'employee1' } })

        let firstName = await rendered.container.querySelector('#firstName');
        fireEvent.change(firstName, { target: { value: 'test1' } })

        let lastName = await rendered.container.querySelector('#lastName');
        fireEvent.change(lastName, { target: { value: 'test1' } })

        let email = await rendered.container.querySelector('#email');
        fireEvent.change(email, { target: { value: 'test@test.com' } })
        
        let phoneNumber = await rendered.container.querySelector('#phoneNumber');
        fireEvent.change(phoneNumber, { target: { value: '954949494' } })

        let password = await rendered.container.querySelector('#password');
        fireEvent.change(password, { target: { value: '123456' } })

        let send = await rendered.getByRole('button', { name: /Crear/i })
        
        await act(async () => {
            fireEvent.click(send)
        })
        let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
        expect(errorSubmit).not.toBeInTheDocument()

    })
})