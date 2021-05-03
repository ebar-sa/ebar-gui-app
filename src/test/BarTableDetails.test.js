import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, fireEvent} from "@testing-library/react";
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
        ]
    }
}

const tableWithItemsInBill = {
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
        ]
    }
}

function renderDetailsFormAdmin(auth) {
    window.sessionStorage.setItem("user", JSON.stringify(auth))
    return render(
        <UserContextProvider>
            <Router history={history} >
                <BarTableDetails {...{match: {params: {id: 1}}}}/>
            </Router>
        </UserContextProvider>)

}

describe('Render test suite', () => {
    beforeEach(() => {
        Enzyme.configure({adapter: new Adapter()});
    })

    it('Pay', async () => {
        mockAxios.onGet().replyOnce(200, tableWithItemsInBill);
        mockAxios.onGet("/tables/tableClient/test-client").replyOnce(200, tableWithItemsInBill)
        mockAxios.onGet("/tables/checkPayment/1").replyOnce(200, {paymentSet: true});
        mockAxios.onPost("/payments/bill/1").replyOnce(200);
        let promise = new Promise(r => setTimeout(r, 350));

        let rendered = renderDetailsFormAdmin(clientAuth);
        await act(() => promise)

        let pay = await rendered.getByRole('button', {name: /Pagar cuenta/i})
        expect(pay).toBeEnabled()

        fireEvent.click(pay, { button: 0 })

        let payDialog = await rendered.getByTestId("pay-dialog")
        expect(payDialog).toBeTruthy()

        let number = await rendered.getByRole('textbox', { name: /Número de tarjeta/i })
        fireEvent.change(number, { target: { value: '4111 1111 1111 1111' } })

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'Antonio Martínez Martínez' } })

        let expiry = await rendered.getByRole('textbox', { name: /Fecha de caducidad/i })
        fireEvent.change(expiry, { target: { value: '01/25' } })

        let cvc = await rendered.getByRole('textbox', { name: /CVC/i })
        fireEvent.change(cvc, { target: { value: '123' } })

        let payButton = await rendered.getByRole('button', {name: /Pagar/i})

        fireEvent.click(payButton, { button: 0 })

        promise = new Promise(r => setTimeout(r, 500));
        await act(() => promise)

        let success = await rendered.getByTestId("pay-processing")
        expect(success).toBeTruthy()
    })

    it('Render with a correct Free BarTable', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataLibre)
        window.sessionStorage.setItem("user",JSON.stringify(auth));
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
    it('Render with a correct Ocupate BarTable', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataTableOcupated)
        window.sessionStorage.setItem("user",JSON.stringify(auth));
        let rendered = renderDetailsFormAdmin(auth);

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)

        let name = await rendered.findByText('Mesa 1')
        let token = await rendered.findByText('jdh-256')
        let estadoMesa = await rendered.findByText('Ocupada')
        let botonDesocupar = await rendered.findByText('Desocupar Manualmente')

        expect(name).toBeInTheDocument()
        expect(token).toBeInTheDocument()
        expect(estadoMesa).toBeInTheDocument()
        expect(botonDesocupar).toBeInTheDocument()

    })


    it('Render with a correct Ocupate BarTable with botton', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataLibre)
        mockAxios.onGet().replyOnce(200,detailsDataTableOcupated);
        let rendered = renderDetailsFormAdmin(auth);

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)
        
        let ocupate = await rendered.getByRole('button', {name: /Ocupar Manualmente/i})
        
        await act(async () => {
            fireEvent.click(ocupate)
        })

        expect(rendered.findByText('Desocupar Manualmente'));
        expect(rendered.findByText('Volver'));

    })
    it('Render with a correct Desocupate BarTable with botton', async () => {
        mockAxios.onGet().replyOnce(200, detailsDataTableOcupated)
        mockAxios.onGet().replyOnce(200,detailsDataLibre);
        let rendered = renderDetailsFormAdmin(auth);

        let promise = new Promise(r => setTimeout(r, 350));
        await act(() => promise)
        
        let ocupate = await rendered.getByRole('button', {name: /Desocupar Manualmente/i})
        
        await act(async () => {
            fireEvent.click(ocupate)
        })

        expect(rendered.findByText('Ocupar Manualmente'));
        expect(rendered.findByText('Volver'));

    })

});
