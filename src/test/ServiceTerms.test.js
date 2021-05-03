import React from 'react';
import { Router } from 'react-router-dom';
import { act, render } from "@testing-library/react";

import { createMemoryHistory } from 'history';

import Context from '../context/UserContext';
import ServiceTerms from "../pages/ServiceTerms";

const setAuth = jest.fn()
const badAuth = {}
const history = createMemoryHistory()

describe('Render test suite', () => {
    it('Render terms', async () => {
        let rendered = render(
            <Context.Provider value={{ badAuth, setAuth }} >
                <Router history={history} >
                    <ServiceTerms history={history} />
                </Router>
            </Context.Provider >)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let banner = await rendered.findAllByText(/Términos y condiciones/i)

        expect(banner[0]).toBeInTheDocument()
    })
});
