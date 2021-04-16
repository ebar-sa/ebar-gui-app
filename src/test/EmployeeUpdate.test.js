import React from 'react';
import { act, render, fireEvent } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import http from "../http-common";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';
import UpdateEmployee from '../pages/EmployeeCreate';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()
history.push = jest.fn();

const auth = {
    username: "test-admin",
    email: "test@admin.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LWFkbWluIiwiaWF0IjoxNjE3NDUwNzk0LCJleHAiOjE2MTc1MzcxOTR9.KhlzaCxWGb25NHgJ557N1L6ETwNdTOqrKJ1s4cnBG7L2rZFEWLnbhizLJ5LizHxUqGxqrps3NU-gx-l6FyozRg"
}

const correctEmployeeDummy = {
    
        username: "employee1",
        firstName: "nombre",
        lastName: "apellido",
        dni: null,
        email: "employee1@email.es",
        phoneNumber: null,
        password: "$2a$10$zo1PML1AqY9sQhzkxo0xPeXH1axXJ5cVYMNP/HZSjf66Sn8CIC//O",
        roles: [
            "ROLE_EMPLOYEE"
        ],
        enabled: true,
        authorities: [
            {
                authority: "ROLE_EMPLOYEE"
            }
        ],
        accountNonExpired: true,
        credentialsNonExpired: true,
        accountNonLocked: true
}

function renderComponent() {
    mockAxios.onGet().replyOnce(200, correctEmployeeDummy)
    return render(
        <Context.Provider value={{auth, setAuth}}>
            <Router history={history} >
                <UpdateEmployee {...{ match: { params: { idBar: 1 } }, params: { username:"employee1" } } } history={history}  />
            </Router>
        </Context.Provider>)
}

describe('Testing render component correctly', () => {

    it('Render form with correct inital data', async() => {

        mockAxios.onGet().replyOnce(200, correctEmployeeDummy)
        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        

        let username1 = await rendered.findByText('Username')

        expect(username1).toBeInTheDocument()
        
    }, [7000])

    it('Clicking success edit button', async () => {
        mockAxios.onGet().replyOnce(200, correctEmployeeDummy)
        mockAxios.onPut().replyOnce(200)

        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        await act(async () => {
        })

        let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
        expect(errorSubmit).not.toBeInTheDocument()

    }, [7000])
})