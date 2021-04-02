import React from 'react';
import { Router } from 'react-router-dom';
import { render } from "@testing-library/react";

import { createMemoryHistory } from 'history';
import MockAdapter from 'axios-mock-adapter';

import VotingDetailUser from '../pages/VotingDetail';
import Context from '../context/UserContext';
import http from '../http-common';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()

const auth = {username:"client1",
    email:"cliente1@email.es",
    roles:["ROLE_CLIENT"],
    tokenType:"Bearer",
    accessToken:"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbGllbnQxIiwiaWF0IjoxNjE3MjI5NTU5LCJleHAiOjE2MTczMTU5NTl9.LxHqCTwu1qwInB_Taq8W-cS_WOiWX888XlctK_AYWpBO2qtl5ntw2IPgvV9qibDLj8zpnx3E0MsTOk7SPL2Dbw"
}

const correctVotingDummy = {
    title: "example voting",
    description: "testing description",
    openingHour: "26-03-2021 00:00:00",
    closingHour: "01-07-2021 23:59:00",
    timer: null,
    votersUsernames : [],
    options: [
        {
            id: 1,
            description: "si",
            votes: 0
        },
        {
            id: 2,
            description: "no",
            votes: 0
        }

    ]
}

describe('Render test suite', () => {
    it('Render with a correct voting', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(200, correctVotingDummy)

        rendered = render(
            <Context.Provider value={{auth, setAuth}}>
                <Router history={history} >
                    <VotingDetailUser {...{match: {params: {votingId: 99}}}}/>
                </Router>
            </Context.Provider>)
        
        await new Promise(r => setTimeout(r, 250)); 
        
        let option1 = await rendered.findByText('si')
        let option2 = await rendered.findByText('no')
        let votingDescription = await rendered.findByText('testing description')

        expect(option1).toBeInTheDocument() 
        expect(option2).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()
    })

});