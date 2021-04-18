import React from 'react';
import { Router } from 'react-router-dom';
import { act, render, screen } from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Map from '../components/map'
import Context from '../context/UserContext';
import http from '../http-common';


jest.mock('@react-google-maps/api', () => {
    return {
        withGoogleMap: (Component) => Component,
        withScriptjs: (Component) => Component,
        Polyline: (props) => <div />,
        InfoWindow: (props) => <div />,
        Marker: (props) => (<div />),
        GoogleMap: (props) => (<div><div data-testid="map"  className="mock-google-maps" />{props.children}</div>),
    };
});


const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const location = { lat: 37.589896, lng:- 4.982296}
const setLocation = function() {
    //empty function necessary
};
const setError = function () {
    //empty function necessary
};
const error = false

const barList = [
    {
        "id": 1,
        "name": "Burger Food Porn",
        "capacity": "7/11",
        "location": "Calle Salesianos, #13, 06011 Badajoz"
    },
    {
        "id": 2,
        "name": "Bar Casa Luna",
        "capacity": "2/14",
        "location": "Calle Este, 18, 41409 Écija, Sevilla"
    }
]

describe('Render test map', () => {

    beforeEach(() => {
        global.navigator = { geolocation: { getCurrentPosition: jest.fn() } };
    });

    

    global.google = {
        maps: {
            LatLngBounds: () => ({
                extend: () => {
                    //blank function necessary
                },
            }),
            Geocoder: () => {
                //blank function necessary
            },
            GeocoderStatus: {
                ERROR: 'ERROR',
                INVALID_REQUEST: 'INVALID_REQUEST',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS',
            },
            MapTypeId: {
                ROADMAP: 'rdmap',
                SATELLITE: 'stllte'
            },
            ControlPosition: {
                BOTTOM_CENTER: 'BC',
                BOTTOM_LEFT: 'BL',
                BOTTOM_RIGHT: 'BR',
                LEFT_BOTTOM: 'LB',
                LEFT_CENTER: 'LC',
                LEFT_TOP: 'LT',
                RIGHT_BOTTOM: 'RB',
                RIGHT_CENTER: 'RC',
                RIGHT_TOP: 'RT',
                TOP_CENTER: 'TC',
                TOP_LEFT: 'TL',
                TOP_RIGHT: 'TR',
            },
            Size: function (w, h) {
                //blank function necessary
            },
            Data: class {
                setStyle() {
                    //blank function necessary
                }
                addListener() {
                    //blank function necessary
                }
                setMap() {
                    //blank function necessary
                }
            },
        }
    };    

    it('Render map with a correct list of bars', async () => {
        
        mockAxios.onGet().replyOnce(200, barList)

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

        render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history} >
                    <Map location={location} setLocation={setLocation} error={error} setError={setError} />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 3500));
        await act(() => promise)

        
        let name = screen.getByTestId("map")
        expect(name).toBeInTheDocument()
        let marker = screen.getByTestId("marker-0")
        expect(marker).toBeInTheDocument()
    })

});