import React from 'react';
import { render } from "@testing-library/react";
import Home from '../pages/Home';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';

// Hide warning
console.error = () => {
    //empty function necessary
}
const setAuth = jest.fn()
const history = createMemoryHistory()
history.push = jest.fn();

jest.mock('@react-google-maps/api', () => {
    return {
        withGoogleMap: (Component) => Component,
        withScriptjs: (Component) => Component,
        Polyline: (props) => <div />,
        InfoWindow: (props) => <div />,
        Marker: (props) => (<div />),
        GoogleMap: (props) => (<div><div data-testid="map" className="mock-google-maps" />{props.children}</div>),
    };
});



const auth = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

describe('Render test home', () => {

    global.google = {
        maps: {
            places:{
                Autocomplete: function () {
                    return { addListener: jest.fn(), getPlacePredictions: jest.fn() };
                },
                event: { trigger: jest.fn() }
            }
            ,
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

    const Map = () => {
        return (<div></div>);
    };
    const LocationSearch = () => {
        return (<div></div>);
    };
    jest.mock('../components/map', () => Map);
    jest.mock('../components/LocationSearch', () => LocationSearch);

    it('Location search', async () => {

        const rendered = render(
        <Context.Provider value={{ auth, setAuth }}>
            <Router history={history} >
                <Home />
            </Router>
        </Context.Provider>);

        let header = await rendered.findByText('¿En que zona desea buscar restaurantes?')
        expect(header).toBeInTheDocument()

        })
})