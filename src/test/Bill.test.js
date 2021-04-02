
import React from 'react';
import { Router } from 'react-router-dom';
import {act, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import UserBillDetails from '../components/user-bill.component';
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

const bill = {
    "id": 1,
    "itemBill":[
        {
        "id":1,
        "amount":"3",
        "itemMenu":{
            "id":2,
            "name":"Tortilla de patatas",
            "description":"descripcion",
            "rationType":null,
            "price":null,
            "category":null,
            "image":null,
        }
     }
     ],
     "itemOrder":[
         {
        "id":2,
        "name":"Calamares",
        "description":"descripcion 2",
        "rationType":null,
        "price":3.2,
        "category":null,
        "image":null
    }
]


 }
 

describe('Render test suite', () => {
    it('Render with a correct bill', async () => {

        mockAxios.onGet().replyOnce(200, bill)

        let rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <UserBillDetails {...{match: {params: {billId: 1}}}}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let amount = await rendered.findByText('Ensaladilla')
        let name = await rendered.findByText('Calamares')
        let price = await rendered.findByText('3.2')

        expect(amount).toBeInTheDocument()
        expect(name).toBeInTheDocument()
        expect(price).toBeInTheDocument()
    })

});