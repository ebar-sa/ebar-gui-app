import React from 'react';
import { Router } from 'react-router-dom';
import {act, render, queryByAttribute, fireEvent} from "@testing-library/react";
import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme';

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Context from '../context/UserContext';
import http from '../http-common';
import BarTableDetails from '../components/BarTableDetails.component';
import BottomBar from '../components/bottom-bar';
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

function renderDetailsFormAdmin(auth) {
    return render(
        <Context.Provider value={{auth, setAuth}}>
            <Router history={history} >
                <BarTableDetails {...{match: {params: {id: 1}}}}/>
            </Router>
        </Context.Provider>)

}
describe('Render test suite', () => {
    beforeEach(() => {
        Enzyme.configure({adapter: new Adapter()});
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
        window.sessionStorage.setItem("user",JSON.stringify(auth));
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
        window.sessionStorage.setItem("user",JSON.stringify(auth));
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
