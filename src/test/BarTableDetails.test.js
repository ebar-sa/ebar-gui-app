import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent, screen} from "@testing-library/react";
import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme';

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import {UserContextProvider} from '../context/UserContext';
import http from '../http-common';
import BarTableDetails from '../components/BarTableDetails.component';

const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_OWNER"],
    tokenType:"Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const clientAuth = {
    username: "test-client",
    email: "test@client.com",
    roles: ["ROLE_CLIENT"],
    tokenType:"Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const detailsDataLibre = {
    0:{
        "id" : 1,
        "name": "Mesa 1",
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
const detailsDataTableOcupated = {    
    0:{
    "id" : 1,
    "name": "Mesa 1",
    "token": "jdh-256", 
    "free": false,
    "seats": 5,
    "bar_id": null,
    "trabajador_id": null,
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
        "itemBill": [
        {
            "id": 1,
            "amount": 3,
            "itemMenu": {
                "id": 1,
                "name": "Ensaladilla",
                "description": "descripcion",
                "rationType": "RATION",
                "price": 2.5,
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
            },
            "new": false
        }
        ],
        "itemOrder": [
            {
                "id": 1,
                "amount": 1,
                "itemMenu": {
                    "id": 1,
                    "name": "Pan",
                    "description": "descripcion",
                    "rationType": "RATION",
                    "price": 2,
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
                },
                "new": false
            }
        ]
    }
}

const detailsDataTableOcupatedWithoutBill = {
    0: {
        "id": 1,
        "name": "Mesa 1",
        "token": "jdh-256",
        "free": false,
        "seats": 5,
        "bar_id": null,
        "trabajador_id": null,
    },
    1: {
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
    2: {
        "id": 1,
        "itemBill": [],
        "itemOrder": []
    }
}

const bill = {
    "id": 1,
    "itemBill": [
        {
            "id": 1,
            "amount": 3,
            "itemMenu": {
                "id": 1,
                "name": "Ensaladilla",
                "description": "descripcion",
                "rationType": "RATION",
                "price": 2.5,
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
            },
            "isClient": true
        }
    ]
}


function renderDetailsFormAdmin(auth) {
    window.localStorage.setItem("user", JSON.stringify(auth))
    return render(
        <UserContextProvider>
            <Router history={history} >
                <BarTableDetails history={history} {...{match: {params: {id: 1}}}}/>
            </Router>
        </UserContextProvider>)

}

const paymentSet = {'paymentSet':true}



describe('Render first test suite', () => {
    beforeEach(() => {
        Enzyme.configure({adapter: new Adapter()});
    })

    it('Render with a correct Free BarTable', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataLibre)
        window.localStorage.setItem("user",JSON.stringify(auth));
        global.innerWidth = 1025;
        window.dispatchEvent(new Event('resize'));
        let rendered = renderDetailsFormAdmin(auth);
        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)
            
        let name = await rendered.findByText('Mesa 1')
        let token = await rendered.findByText('jdh-256')
        let estadoMesa = await rendered.findByText('Libre')
        let botonOcupar = await rendered.findByText('Ocupar Manualmente')

        expect(name).toBeInTheDocument()
        expect(token).toBeInTheDocument()
        expect(estadoMesa).toBeInTheDocument()
        expect(botonOcupar).toBeInTheDocument()
        
    })
    it('Render with a correct Ocupate BarTable admin', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataTableOcupated)
        window.localStorage.setItem("user",JSON.stringify(auth));
        let rendered = renderDetailsFormAdmin(auth);

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)

        let name = await rendered.findByText('Mesa 1')
        let estadoMesa = await rendered.findByText('Ocupada')
        let botonDesocupar = await rendered.findByText('Desocupar Manualmente')

        expect(name).toBeInTheDocument()
        expect(estadoMesa).toBeInTheDocument()
        expect(botonDesocupar).toBeInTheDocument()
    })

    it('Render with a correct Ocupate BarTable client2', async () => {

        mockAxios.onGet().replyOnce(200, detailsDataTableOcupated)
        mockAxios.onGet().replyOnce(200, paymentSet)
        
        window.sessionStorage.setItem("user", JSON.stringify(clientAuth));
        let rendered = renderDetailsFormAdmin(clientAuth);

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)

        let refresh = await rendered.getByRole('button', { name: /Refrescar comanda/i })
        let amount = await rendered.getByRole('spinbutton', { name: /Cantidad/i })
        fireEvent.change(amount, { target: { value: '2' } })
        expect(amount.value).toBe('2')

        let add = await rendered.getByRole('button', { name: /A??adir/i })

        await act(async () => {
            fireEvent.click(add)
            mockAxios.onGet().replyOnce(200, bill)
            fireEvent.click(refresh)
            mockAxios.onGet().replyOnce(200, detailsDataTableOcupated)
            let total = await rendered.getAllByRole('cell', { name: /7.5 ???/i })
            expect(total[0]).toBeInTheDocument()
            let pay = await rendered.getByRole('button', { name: /Pagar cuenta/i })
            expect(pay).toBeInTheDocument()
            fireEvent.click(pay)  
        })
    },11000)

    it('Render with a correct Ocupate BarTable with button', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataLibre)
        let rendered = renderDetailsFormAdmin(auth);

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)

        let ocupate = await rendered.getByRole('button', { name: /Ocupar Manualmente/i })

        await act(async () => {
            fireEvent.click(ocupate)
        })
        mockAxios.onGet().replyOnce(200, detailsDataTableOcupated);

        expect(rendered.findByText('Desocupar Manualmente'));
        expect(rendered.findByText('Volver'));

    })

    it('Render with a correct Desocupate BarTable with button', async () => {

        mockAxios.onGet().replyOnce(200, detailsDataTableOcupated)
        let rendered = renderDetailsFormAdmin(auth);

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)

        let ocupate = await rendered.getByRole('button', { name: /Desocupar Manualmente/i })

        await act(async () => {
            fireEvent.click(ocupate)
        })
        mockAxios.onGet().replyOnce(200, detailsDataLibre);

        expect(rendered.findByText('Ocupar Manualmente'));
        expect(rendered.findByText('Volver'));

    }, 8000)

})
