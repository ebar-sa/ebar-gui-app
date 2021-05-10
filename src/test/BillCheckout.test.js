import React from 'react';
import { Router } from 'react-router-dom';
import { act, render, fireEvent, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';
import userEvent from '@testing-library/user-event';
import BillCheckout from '../pages/BillCheckout';
import MockAdapter from 'axios-mock-adapter'
import http from '../http-common'

const setAuth = jest.fn()
const history = createMemoryHistory()
const mockAxios = new MockAdapter(http)

const auth = {
    username: "test-owner",
    email: "test@owner.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg",
    braintreeMerchantId: '',
    braintreePublicKey: '',
    braintreePrivateKey: '',
}

describe('BillCheckout test suite', () => {

    it('Correct submit billCheckout', async () => {

        mockAxios.onPost().replyOnce(200, {})


        let rendered = render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history}>
                    <BillCheckout/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title = await rendered.findByText('Pago de la cuenta')
        expect(title).toBeInTheDocument()

        let number = await rendered.getByRole('textbox', { name: /Número de tarjeta/i })
        fireEvent.change(number, { target: { value: '4242 4242 4242 4242' } })
        expect(number.value).toBe('4242 4242 4242 4242')

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'Visa' } })
        expect(name.value).toBe('Visa')

        let date = await rendered.getByRole('textbox', { name: /Fecha de caducidad/i })
        fireEvent.change(date, { target: { value: '04/22' } })
        expect(date.value).toBe('04/22')

        let cvc = await rendered.getByRole('textbox', { name: /CVC/i })
        fireEvent.change(cvc, { target: { value: '422' } })
        expect(cvc.value).toBe('422')

        let send = await rendered.getByRole('button', { name: /Pagar/i })

        await act(async () => {
            fireEvent.click(send)
        })

        let processing = await rendered.findByText('Procesando el pago')
        expect(processing).toBeInTheDocument()
    })

    it('Incorrect submit bill', async () => {

        mockAxios.onPost().replyOnce(200, {})


        let rendered = render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history}>
                    <BillCheckout />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 2500));
        await act(() => promise)
        jest.setTimeout(3500)
        
        let send = await rendered.getByRole('button', { name: /Pagar/i })

        await act(async () => {
            fireEvent.click(send)
        })

        let nameError = await rendered.findByText('El nombre no puede estar vacío')
        expect(nameError).toBeInTheDocument()

        let dateError = await rendered.findByText('La fecha de caducidad no puede estar vacía')
        expect(dateError).toBeInTheDocument()

        let cvcError = await rendered.findByText('El código CVC no puede estar vacío')
        expect(cvcError).toBeInTheDocument()
    })

    it('Amex card', async () => {

        mockAxios.onPost().replyOnce(200, {})


        let rendered = render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history}>
                    <BillCheckout />
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let number = await rendered.getByRole('textbox', { name: /Número de tarjeta/i })
        fireEvent.change(number, { target: { value: '3700 0000 0000 002' } })
        expect(number.value).toBe('3700 000000 00002')

        let name = await rendered.getByRole('textbox', { name: /Nombre/i })
        fireEvent.change(name, { target: { value: 'American Express' } })
        expect(name.value).toBe('American Express')

        let date = await rendered.getByRole('textbox', { name: /Fecha de caducidad/i })
        fireEvent.change(date, { target: { value: '03/30' } })
        expect(date.value).toBe('03/30')

        let cvc = await rendered.getByRole('textbox', { name: /CVC/i })
        fireEvent.change(cvc, { target: { value: '7373' } })
        expect(cvc.value).toBe('7373')

        let send = await rendered.getByRole('button', { name: /Pagar/i })

        await act(async () => {
            fireEvent.click(send)
        })

    })

})