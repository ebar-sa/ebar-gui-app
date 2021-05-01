import React from 'react';
import { Router } from 'react-router-dom';
import {act, fireEvent, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import BarList from '../pages/BarList';
import Context from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth_client = {username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const auth_owner = {username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}


const barListWithoutCoord = [
    {
        "id": 1,
        "name": "Burger Food Porn",
        "capacity": "7/11",
        "location": "Avenida de Finlandia, 24, 41012 Sevilla",
        "coord": {lat: null , lng: null},
        "distance": null
    },
    {
        "id": 2,
        "name": "Bar Casa Paco",
        "capacity": "2/14",
        "location": "Calle Ave María, 1, 41510 Mairena del Alcor, Sevilla",
        "coord": {lat: null, lng: null},
        "distance": null
    }
]

const barResult = [
    {
        "id": 2,
        "name": "Bar Casa Paco",
        "capacity": "2/14",
        "location": "Calle Ave María, 1, 41510 Mairena del Alcor, Sevilla",
        "coord": {lat: 37.3714015, lng: -5.755797800000001},
        "distance": 1173.9327954001758
    }
]

const barList = [
    {
        "id": 1,
        "name": "Burger Food Porn",
        "capacity": "7/11",
        "location": "Avenida de Finlandia, 24, 41012 Sevilla",
        "coord": {lat: 26.3714015, lng: -6.755797800000001},
        "distance": 50
    },
    {
        "id": 2,
        "name": "Bar Casa Paco",
        "capacity": "2/14",
        "location": "Calle Ave María, 1, 41510 Mairena del Alcor, Sevilla",
        "coord": {lat: 37.3714015, lng: -5.755797800000001},
        "distance": 1173.9327954001758
    }
]

describe('Render test suite', () => {
    
    it('Render with a correct list of bars with owner', async () => {

        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, barList)

        const mockGeolocationOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: 37.589470,
                        longitude: -4.982660,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationOK

        let rendered = render(
            <Context.Provider value={{auth: auth_owner, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let pageTitle = await rendered.findByText('Mis bares')
        let title1 = await rendered.findByText('Burger Food Porn')
        let title2 = await rendered.findByText('Bar Casa Paco')
        let capacity1 = await rendered.findByText('Mesas disponibles: 7/11')
        let capacity2 = await rendered.findByText('Mesas disponibles: 2/14')
        let distance1 = await rendered.queryByTestId('distance1')
        let distance2 = await rendered.queryByTestId('distance2')

        expect(pageTitle).toBeInTheDocument()
        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(capacity1).toBeInTheDocument()
        expect(capacity2).toBeInTheDocument()
        expect(distance1).toBeInTheDocument()
        expect(distance2).toBeInTheDocument()
    })

    it('Render with a correct list of bars with client', async () => {

        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, barList)        

        const mockGeolocationOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: 37.589470,
                        longitude: -4.982660,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationOK

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let pageTitle = await rendered.findByText('Lista de bares disponibles')
        let title1 = await rendered.findByText('Burger Food Porn')
        let title2 = await rendered.findByText('Bar Casa Paco')
        let capacity1 = await rendered.findByText('Mesas disponibles: 7/11')
        let capacity2 = await rendered.findByText('Mesas disponibles: 2/14')
        let distance1 = await rendered.queryByTestId('distance1')
        let distance2 = await rendered.queryByTestId('distance2')

        expect(pageTitle).toBeInTheDocument()
        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(capacity1).toBeInTheDocument()
        expect(capacity2).toBeInTheDocument()
        expect(distance1).toBeInTheDocument()
        expect(distance2).toBeInTheDocument()
    })

    it('Render with a correct list of bar with null distance', async () => {

        mockAxios.onPost().replyOnce(200, barListWithoutCoord)
        mockAxios.onPost().replyOnce(200, barListWithoutCoord)


        const mockGeolocationOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: 37.589470,
                        longitude: -4.982660,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationOK

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title1 = await rendered.findByText('Burger Food Porn')
        let title2 = await rendered.findByText('Bar Casa Paco')
        let capacity1 = await rendered.findByText('Mesas disponibles: 7/11')
        let capacity2 = await rendered.findByText('Mesas disponibles: 2/14')
        let distance1 = await rendered.queryByTestId('distance1')
        let distance2 = await rendered.queryByTestId('distance2')

        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(capacity1).toBeInTheDocument()
        expect(capacity2).toBeInTheDocument()
        expect(distance1).not.toBeInTheDocument()
        expect(distance2).not.toBeInTheDocument()
    })

    it('Render with a correct list of bar with null user location', async () => {

        mockAxios.onPost().replyOnce(200, barListWithoutCoord)
        mockAxios.onPost().replyOnce(200, barListWithoutCoord)

        const mockGeolocationNullOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: null,
                        longitude: null,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationNullOK

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title1 = await rendered.findByText('Burger Food Porn')
        let title2 = await rendered.findByText('Bar Casa Paco')
        let capacity1 = await rendered.findByText('Mesas disponibles: 7/11')
        let capacity2 = await rendered.findByText('Mesas disponibles: 2/14')
        let distance1 = await rendered.queryByTestId('distance1')
        let distance2 = await rendered.queryByTestId('distance2')

        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(capacity1).toBeInTheDocument()
        expect(capacity2).toBeInTheDocument()
        expect(distance1).not.toBeInTheDocument()
        expect(distance2).not.toBeInTheDocument()
    })


    it('Render with a correct list of bars', async () => {

        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, barList)


        const mockGeolocationOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: 37.589470,
                        longitude: -4.982660,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationOK

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title1 = await rendered.findByText('Burger Food Porn')
        let title2 = await rendered.findByText('Bar Casa Paco')
        let capacity1 = await rendered.findByText('Mesas disponibles: 7/11')
        let capacity2 = await rendered.findByText('Mesas disponibles: 2/14')
        let distance1 = await rendered.queryByTestId('distance1')
        let distance1Value = await rendered.queryByText('A 50 metros')
        let distance2Value = await rendered.queryByText('A 1.17 kilometros')
        let distance2 = await rendered.queryByTestId('distance2')

        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(capacity1).toBeInTheDocument()
        expect(capacity2).toBeInTheDocument()
        expect(distance1Value).toBeInTheDocument()
        expect(distance2Value).toBeInTheDocument()
        expect(distance1).toBeInTheDocument()
        expect(distance2).toBeInTheDocument()
    })

    it('Search bars with < 3 chars', async () => {

        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, barList)

        const mockGeolocationOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: 37.589470,
                        longitude: -4.982660,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationOK

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let searchBar = await rendered.container.querySelector("#input-with-icon-grid")


        await act(async () => {
            await fireEvent.change(searchBar, { target: { value: 'Ba' } })
        })

        promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let pageTitle = await rendered.findByText('Lista de bares disponibles')
        let title1 = await rendered.queryByText('Burger Food Porn')
        let title2 = await rendered.queryByText('Bar Casa Paco')
        let expectedMessage = await rendered.queryByTestId('less_than_three_alert')

        expect(pageTitle).toBeInTheDocument()
        expect(title1).not.toBeInTheDocument()
        expect(title2).not.toBeInTheDocument()
        expect(expectedMessage).toBeInTheDocument()
    })

    it('Search bars with > 3 chars', async () => {

        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, barResult)

        const mockGeolocationOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: 37.589470,
                        longitude: -4.982660,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationOK

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let searchBar = await rendered.container.querySelector("#input-with-icon-grid")


        await act(async () => {
            await fireEvent.change(searchBar, { target: { value: 'Bar' } })
        })

        promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let pageTitle = await rendered.findByText('Lista de bares disponibles')
        let title1 = await rendered.queryByText('Burger Food Porn')
        let title2 = await rendered.queryByText('Bar Casa Paco')

        expect(pageTitle).toBeInTheDocument()
        expect(title1).not.toBeInTheDocument()
        expect(title2).toBeInTheDocument()
    })

    it('Search bars with > 3 chars without result', async () => {

        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200, [])

        const mockGeolocationOK = {
            getCurrentPosition: jest.fn()
                .mockImplementationOnce(success => Promise.resolve(success({
                    coords: {
                        latitude: 37.589470,
                        longitude: -4.982660,
                    },
                })), err => {
                    console.log('Error', err)
                }),
            watchPosition: jest.fn(),
        }

        global.navigator.geolocation = mockGeolocationOK

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let searchBar = await rendered.container.querySelector("#input-with-icon-grid")


        await act(async () => {
            await fireEvent.change(searchBar, { target: { value: 'Bar' } })
        })

        promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let pageTitle = await rendered.findByText('Lista de bares disponibles')
        let title1 = await rendered.queryByText('Burger Food Porn')
        let title2 = await rendered.queryByText('Bar Casa Paco')
        let noResultAlert = await rendered.queryByTestId('no_result_alert')

        expect(pageTitle).toBeInTheDocument()
        expect(title1).not.toBeInTheDocument()
        expect(title2).not.toBeInTheDocument()
        expect(noResultAlert).toBeInTheDocument()
    })

    it('Waiting for location permissions ', async () => {

        mockAxios.onPost().replyOnce(400, barList)
        mockAxios.onPost().replyOnce(400, barList)

        let rendered = render(
            <Context.Provider value={{auth: auth_client, setAuth}}>
                <Router history={history} >
                    <BarList />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let locationAlert = await rendered.queryByTestId("location_alert")

        expect(locationAlert).toBeInTheDocument()
    })

});