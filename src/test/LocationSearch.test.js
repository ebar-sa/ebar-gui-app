import React from 'react';
import { Router } from 'react-router-dom';
import { render, fireEvent, wait } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import { configure } from 'enzyme';
import LocationSearch from '../components/LocationSearch'
import Context from '../context/UserContext';
import Adapter from 'enzyme-adapter-react-16';

const setAuth = jest.fn()
const history = createMemoryHistory()

const auth = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}


const setLocation = function () {
    //empty function necessary
};
const setError = function () {
    //empty function necessary
};


describe('Render test location search', () => {

    configure({ adapter: new Adapter() });

    global.google = {
        maps: {
            places: {
                Autocomplete: function () {
                    return { addListener: jest.fn(), getPlacePredictions: jest.fn() };
                },
                event: { trigger: jest.fn() }
            }
        }   
    };

    
    it('Location search', async () => {

        const rendered = render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history} >
                    <LocationSearch setLocation={setLocation} setError={setError}/>
                </Router>
            </Context.Provider>)

        const autocomplete = rendered.getByTestId('autocomplete-search');
        autocomplete.focus()
        fireEvent.change(autocomplete, { target: { value: 'Calle La Ronda' } })
        await wait()

        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' })
        await wait()
        fireEvent.keyDown(autocomplete, { key: 'Enter' })
        await wait()
        fireEvent.click(autocomplete);
        expect(autocomplete.value).toEqual('Calle La Ronda')
    });

})
