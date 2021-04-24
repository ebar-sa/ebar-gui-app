import React from 'react';
import { act, fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import Votings from '../pages/VotingList';
import http from "../http-common";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';
import userEvent from '@testing-library/user-event'

// Hide warning
console.error = () => {
    //empty function necessary
 }

const votings = [
    {
        "id": 1,
        "title": "Próxima canción",
        "description": "Próxima canción pinchada",
        "openingHour": "02-02-2021 11:00:00",
        "closingHour": "11-03-2021 00:00:00",
        "timer": 2,
        "options": [
            {
                "id": 2,
                "description": "Gasolina",
                "votes": 0,
                "new": false
            },
            {
                "id": 1,
                "description": "Pobre diabla",
                "votes": 0,
                "new": false
            },
            {
                "id": 3,
                "description": "Despacito",
                "votes": 0,
                "new": false
            }
        ],
        "votersUsernames": [
            'test-user'
        ]
    },
    {
        "id": 2,
        "title": "Última canción",
        "description": "Última canción pinchada de la noche",
        "openingHour": "05-02-2021 11:00:00",
        "closingHour": "10-10-2021 02:00:00",
        "timer": 3,
        "options": [
            {
                "id": 5,
                "description": "Fiesta pagana",
                "votes": 0,
                "new": false
            },
            {
                "id": 4,
                "description": "El farsante",
                "votes": 0,
                "new": false
            }
        ],
        "votersUsernames": [
            'test-user'
        ]
    },
    {
        "id": 3,
        "title": "Otra canción",
        "description": "Otra canción a escuchar",
        "openingHour": "05-02-2021 11:00:00",
        "closingHour": null,
        "timer": 3,
        "options": [
            {
                "id": 6,
                "description": "Final countdown",
                "votes": 0,
                "new": false
            },
            {
                "id": 7,
                "description": "Lean",
                "votes": 0,
                "new": false
            }
        ],
        "votersUsernames": []
    },
    {
        "id": 4,
        "title": "Votación sin fin",
        "description": "Vota sin fin",
        "openingHour": "05-12-2021 11:00:00",
        "closingHour": null,
        "timer": 3,
        "options": [
            {
                "id": 8,
                "description": "Tsunami",
                "votes": 0,
                "new": false
            },
            {
                "id": 9,
                "description": "Without me",
                "votes": 0,
                "new": false
            }
        ],
        "votersUsernames": []
    }
]

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()
history.push = jest.fn();

const client = {
    username: "test-user",
    email: "test@user.com",
    roles: ["ROLE_CLIENT"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkYW5pMyIsImlhdCI6MTYxNzMyNjA3NywiZXhwIjoxNjE3NDEyNDc3fQ.Hcpf9naGfM1FiQ6CEdBMthcsa9m9rIHs7ae4zaiO7MCPKAT3HpK9Is5fAKbuu7MlF4bLuTN2qctRalxTz8elQg"
}

const admin = {
    username: "test-admin",
    email: "test@admin.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LWFkbWluIiwiaWF0IjoxNjE3NDUwNzk0LCJleHAiOjE2MTc1MzcxOTR9.KhlzaCxWGb25NHgJ557N1L6ETwNdTOqrKJ1s4cnBG7L2rZFEWLnbhizLJ5LizHxUqGxqrps3NU-gx-l6FyozRg"
}

const barList = {
        "id": 1,
        "name": "Burger Food Porn",
        "capacity": "7/11",
        "owner":"test-admin",
        "employees": [{}]
    }

function renderVotingsUser(auth){
    return render(
        <Context.Provider value={{ auth, setAuth }}>
            <Router history={history} >
                <Votings {...{ match: { params: { idBar: 1 } }, history: { location: { state: {} } } }} />
            </Router>
        </Context.Provider>)
}

function renderVotingsAdmin(auth) {
    return render(
        <Context.Provider value={{ auth, setAuth }}>
            <Router history={history} >
                <Votings {...{ match: { params: { idBar: 1 } }, history: { location: { state: {} } } }} />
            </Router>
        </Context.Provider>)
}


describe('Testing Voting list', () => {

    beforeAll(() => {
        jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100);
        jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
    });


    it('Render with correct text user', async () => {
        mockAxios.onGet().replyOnce(200, votings)
        let rendered = renderVotingsUser(client)
        
        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title1 = await rendered.findByText('Próxima canción')
        let title2 = await rendered.findByText('Última canción')
        let title3 = await rendered.findByText('Otra canción')
        let title4 = await rendered.queryByText('Votación sin fin')
        let alreadyVote = await rendered.findByText('Ya has votado')
        let textButton = await rendered.findByText('Acceder')

        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(title3).toBeInTheDocument()
        expect(title4).not.toBeInTheDocument()
        expect(alreadyVote).toBeInTheDocument()
        expect(textButton).toBeInTheDocument()
    })


    it('Render with correct text admin', async () => {

        mockAxios.onGet().replyOnce(200, votings)
        mockAxios.onGet().replyOnce(200, barList)
        window.sessionStorage.setItem("user", JSON.stringify(admin));
        let rendered = renderVotingsAdmin(admin)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title1 = await rendered.findByText('Próxima canción')
        let title2 = await rendered.findByText('Última canción')
        let title3 = await rendered.findByText('Otra canción')
        let title4 = await rendered.queryByText('Votación sin fin')
        let finishButton = await rendered.queryAllByTestId('finish-but')
        // let textButtonCreate = await rendered.findByText('Crear votación')
        // let edit = await rendered.findAllByText('Editar')

        expect(title1).toBeInTheDocument()
        expect(title2).toBeInTheDocument()
        expect(title3).toBeInTheDocument()
        expect(title4).toBeInTheDocument()
        expect(finishButton).toHaveLength(2)
        
        // expect(textButtonCreate).toBeInTheDocument()
        // expect(edit).toHaveLength(1)

    })



    it('Render with incorrect text', async () => {
        mockAxios.onGet().replyOnce(200, votings)
        let rendered = renderVotingsUser(client)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let description = await rendered.queryByText('Última canción pinchada de la noche')
        let date = await rendered.queryByText('Fecha fin: 10-10-2021 02:00')
        expect(description).not.toBeInTheDocument()
        expect(date).not.toBeInTheDocument()
    })

    it('Correct expand current', async () => {
        mockAxios.onGet().replyOnce(200, votings)
        let rendered = renderVotingsUser(client)
        
        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        userEvent.click(screen.getByText('Última canción'))
        userEvent.click(screen.getByText('Otra canción'))
        let description = await rendered.findByText('Última canción pinchada de la noche')
        let date = await rendered.findByText('Fecha fin: 10-10-2021 02:00')
        let description2 = await rendered.findByText('Otra canción a escuchar')
        let date2 = await rendered.findByText('Fecha fin: Indefinida')
        let finishVoting = await rendered.queryByTestId('finish-but')
        expect(description).toBeInTheDocument()
        expect(date).toBeInTheDocument()
        expect(description2).toBeInTheDocument()
        expect(date2).toBeInTheDocument()
        expect(finishVoting).not.toBeInTheDocument()
    })

    it('Incorrect expand current', async () => {
        mockAxios.onGet().replyOnce(200, votings)
        let rendered = renderVotingsUser(client)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        userEvent.click(screen.getByText('Última canción'))
        let results = await rendered.queryByText('Resultados')
        expect(results).not.toBeInTheDocument()

    })

    it('Correct expand past votings', async () => {


        mockAxios.onGet().replyOnce(200, votings)
        let rendered = renderVotingsUser(client)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        userEvent.click(screen.getByText('Próxima canción'))
        let description = await rendered.findByText('Próxima canción pinchada')
        let results = await rendered.findByText('Resultados')
        expect(description).toBeInTheDocument()
        expect(results).toBeInTheDocument()

    })


    it('Incorrect expand past', async () => {
        mockAxios.onGet().replyOnce(200, votings)
        let rendered = renderVotingsUser(client)
        
        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        userEvent.click(screen.getByText('Próxima canción'))
        let date = await rendered.queryByText('Fecha fin: 11-03-2021 00:00')

        expect(date).not.toBeInTheDocument()

    })

    it('Finish voting correct behaviour', async () => {
        mockAxios.onGet().replyOnce(200, votings)
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onPost().replyOnce(200)
        let rendered = renderVotingsUser(admin)
        window.sessionStorage.setItem("user", JSON.stringify(admin));

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        await act(async () => {
            await userEvent.click(screen.getAllByTestId('finish-but')[0])
        })

        let finishDialog = await rendered.queryByTestId('finish-dialog')
        expect(finishDialog).toBeInTheDocument()

        await act(async () => {
            await userEvent.click(screen.getByTestId('accept-finish-button'))
        })

        let finishedAlert = await rendered.queryByTestId('finished-alert')
        expect(finishedAlert).toBeInTheDocument()

        await act(async () => {
            await fireEvent.click(screen.getByTestId('finished-alert').children[0].children[2].children[0])
        })

        promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        finishedAlert = await rendered.queryByTestId('finished-alert')
        expect(finishedAlert).not.toBeInTheDocument()
    })
})

