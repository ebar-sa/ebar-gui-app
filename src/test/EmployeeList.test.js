import React from 'react';
import { Router } from 'react-router-dom';
import {act, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import EmployeeList from '../pages/EmployeeList';
import Context from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const barList = [
    {
        "username": "employee1",
        "firstName": "nombre",
        "lastName": "apellido",
        "dni": null,
        "email": "employee1@email.es",
        "phoneNumber": null,
        "password": "$2a$10$zo1PML1AqY9sQhzkxo0xPeXH1axXJ5cVYMNP/HZSjf66Sn8CIC//O",
        "roles": [
            "ROLE_EMPLOYEE"
        ],
        "enabled": true,
        "authorities": [
            {
                "authority": "ROLE_EMPLOYEE"
            }
        ],
        "accountNonExpired": true,
        "credentialsNonExpired": true,
        "accountNonLocked": true
    },
    {
        "username": "employee2",
        "firstName": "asd",
        "lastName": "sad",
        "dni": "",
        "email": "murillojaenesalberto@gmail.com",
        "phoneNumber": "123456",
        "password": "$2a$10$aL09HrYhSJM1MYzEn.0ijeKeR/HaImSTPLIEkSZIt12lUUXd3nMd6",
        "roles": [
            "ROLE_EMPLOYEE"
        ],
        "enabled": true,
        "authorities": [
            {
                "authority": "ROLE_EMPLOYEE"
            }
        ],
        "accountNonExpired": true,
        "credentialsNonExpired": true,
        "accountNonLocked": true
    },
    {
        "username": "employee3",
        "firstName": "test",
        "lastName": "test",
        "dni": "1234",
        "email": "test@gmail.com",
        "phoneNumber": "1234",
        "password": "$2a$10$OHLy1lrgjod0KzAQXJCIxui4H7Z6khILfXfoWH7hucb6GYzfRQ8JG",
        "roles": [
            "ROLE_EMPLOYEE"
        ],
        "enabled": true,
        "authorities": [
            {
                "authority": "ROLE_EMPLOYEE"
            }
        ],
        "accountNonExpired": true,
        "credentialsNonExpired": true,
        "accountNonLocked": true
    }
]

const bar = {
    "id": 1,
    "name": "Burger Food Porn",
    "capacity": "7/11",
    "owner":"test-user",
    "employees": [{
        "username": "employee1",
        "firstName": "nombre",
        "lastName": "apellido",
        "dni": null,
        "email": "employee1@email.es",
        "phoneNumber": null,
        "password": "$2a$10$zo1PML1AqY9sQhzkxo0xPeXH1axXJ5cVYMNP/HZSjf66Sn8CIC//O",
        "roles": [
            "ROLE_EMPLOYEE"
        ],
        "enabled": true,
        "authorities": [
            {
                "authority": "ROLE_EMPLOYEE"
            }
        ],
        "accountNonExpired": true,
        "credentialsNonExpired": true,
        "accountNonLocked": true
    }]
}

describe('Render test suite', () => {
    it('Render with a correct list of employees', async () => {
        mockAxios.onGet().replyOnce(200, bar)
        mockAxios.onGet().replyOnce(200, barList)
        window.sessionStorage.setItem("user",JSON.stringify(auth))

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <EmployeeList {...{match: {params: {idBar: 1}}}} />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let username1 = await rendered.findByText('employee1')
        let username2 = await rendered.findByText('employee2')

        expect(username1).toBeInTheDocument()
        expect(username2).toBeInTheDocument()
    })

});