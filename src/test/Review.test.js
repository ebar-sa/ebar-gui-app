import React from 'react';
import { Router } from 'react-router-dom';
import {act, fireEvent, render} from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import Review from '../pages/Review';
import Context, {UserContextProvider} from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {username: "test-client",
    email: "test@client.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const bar = {
    "id": 1,
    "name": "Burger Food Porn",
    "description": "El templo de la hamburguesa.",
    "contact": "burgerfoodsevilla@gmail.com",
    "location": "Avenida de Finlandia, 24, Sevilla",
    "openingTime": "1970-01-01T13:00:00.000+00:00",
    "closingTime": "1970-01-01T22:30:00.000+00:00",
    "images": [],
    "tables": 1,
    "freeTables": 1,
    "owner": "test-owner",
    "reviews": []
}

const review = {
    "tableId": 1,
    "items": [
        {
            "name": "Hamburguesa",
            "description": "Deliciosa carne de vacuno",
            "rationType": "Plato",
            "price": 10.50,
            "category": "Hamburguesas",
            "image": null,
            "reviews": []
        }
    ],
    "barReviewed": false,
    "billEmpty": false
}

const reviewWithNoItems = {
    "tableId": 1,
    "items": [],
    "barReviewed": true,
    "billEmpty": false
}

const reviewBillEmpty = {
    "tableId": 1,
    "items": [],
    "barReviewed": true,
    "billEmpty": true
}

describe('Render test suite', () => {
    it('Render with a correct review', async () => {

        mockAxios.onGet("/reviews/abc-123").replyOnce(200, review)
        mockAxios.onGet("/bar/barClient/test-client").replyOnce(200, bar)
        window.localStorage.setItem("user",JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <Review {...{match: {params: {tableToken: "abc-123"}}}}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 2000));
        await act(() => promise)

        let barAccordion = await rendered.findByText('Burger Food Porn')
        let itemAccordion = await rendered.findByText('Hamburguesa')

        expect(barAccordion).toBeInTheDocument()
        expect(itemAccordion).toBeInTheDocument()
    })

    it('Render with a correct review with no reviews to do', async () => {

        mockAxios.onGet("/reviews/abc-123").replyOnce(200, reviewWithNoItems)
        mockAxios.onGet("/bar/barClient/test-client").replyOnce(200, bar)
        window.localStorage.setItem("user",JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <Review {...{match: {params: {tableToken: "abc-123"}}}}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 2000));
        await act(() => promise)

        let barReviewed = await rendered.findByText('Ya has realizado una reseña a este bar')
        let itemsReviewed = await rendered.findByText('Ya has realizado una reseña a los ítems de la cuenta')

        expect(barReviewed).toBeInTheDocument()
        expect(itemsReviewed).toBeInTheDocument()
    })

    it('Render with a correct review with empty bill', async () => {

        mockAxios.onGet("/reviews/abc-123").replyOnce(200, reviewBillEmpty)
        mockAxios.onGet("/bar/barClient/test-client").replyOnce(200, bar)
        window.localStorage.setItem("user",JSON.stringify(auth))

        let rendered = render(
            <UserContextProvider>
                <Router history={history} >
                    <Review {...{match: {params: {tableToken: "abc-123"}}}}/>
                </Router>
            </UserContextProvider>)

        let promise = new Promise(r => setTimeout(r, 2000));
        await act(() => promise)

        let barReviewed = await rendered.findByText('Ya has realizado una reseña a este bar')
        let noItemsBill = await rendered.findByText('No hay ítems en la cuenta')

        expect(barReviewed).toBeInTheDocument()
        expect(noItemsBill).toBeInTheDocument()
    })
})