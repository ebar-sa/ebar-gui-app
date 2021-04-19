import React from 'react';
import { Router } from 'react-router-dom';
import {act, fireEvent, render} from "@testing-library/react";

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
    accessToken:"AnyToken"
}

const correctVotingDummy = {
    id: 99,
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

const closedVotingDummy = {
    id: 99,
    title: "example voting",
    description: "testing description",
    openingHour: "26-03-2021 00:00:00",
    closingHour: "26-03-2021 23:59:00",
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

const alreadyVotedVotingDummy = {
    id: 99,
    title: "example voting",
    description: "testing description",
    openingHour: "26-03-2021 00:00:00",
    closingHour: "01-07-2021 23:59:00",
    timer: null,
    votersUsernames : ['client1',],
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

function renderComponent() {
    return render(
        <Context.Provider value={{auth, setAuth}}>
            <Router history={history} >
                <VotingDetailUser {...{match: {params: {votingId: 99}}}}/>
            </Router>
        </Context.Provider>)
}

describe('Render test suite', () => {
    it('Render with a correct voting', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(200, correctVotingDummy)

        rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        
        let option1 = await rendered.findByText('si')
        let option2 = await rendered.findByText('no')
        let votingDescription = await rendered.findByText('testing description')
        let votingBtn = await rendered.findByText('Enviar votación')
        let cannotVoteBtn = rendered.queryByText("No puedes votar ahora mismo")
        let errorSnackBar = rendered.queryByText("Selecciona una opción")

        expect(option1).toBeInTheDocument() 
        expect(option2).toBeInTheDocument()
        expect(votingBtn).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()
        expect(cannotVoteBtn).not.toBeInTheDocument()
        expect(errorSnackBar).not.toBeInTheDocument()
    })

    it('Render with a closed voting', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(200, closedVotingDummy)

        rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        
        let voteBtn = rendered.queryByText("Enviar votación")
        let cannotVoteBtn = await rendered.findByText('No puedes votar ahora mismo')

        expect(cannotVoteBtn).toBeInTheDocument() 
        expect(voteBtn).not.toBeInTheDocument()
    })

    it('Render emptyPage with a getVoting failure', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(404)

        rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 1050));
        await act(() => promise)
        
        let voteBtn = rendered.queryByText("Enviar votación")
        let cannotVoteBtn = rendered.queryByText('No puedes votar ahora mismo')
        let cannotVoteAlert = rendered.queryByText('No puedes entrar en la votación ahora mismo')
        let emptyPage = rendered.queryByTestId('empty_page')

        expect(cannotVoteBtn).not.toBeInTheDocument()
        expect(voteBtn).not.toBeInTheDocument()
        expect(emptyPage).toBeInTheDocument()
        expect(cannotVoteAlert).toBeInTheDocument()
    })

});

describe('Alert test suite', () => {
    it('Vote when no options are selected', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(200, correctVotingDummy)

        rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        
        let option1 = await rendered.findByText('si')
        let option2 = await rendered.findByText('no')
        let votingDescription = await rendered.findByText('testing description')
        let voteBtn = await rendered.findByText("Enviar votación")
        
        expect(option1).toBeInTheDocument() 
        expect(option2).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()

        fireEvent.click(voteBtn)

        let errorSnackBar = await rendered.findByText("Selecciona una opción")

        expect(errorSnackBar).toBeInTheDocument()
    })

    it('Correctly closing an alert', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(200, correctVotingDummy)
            
        rendered = renderComponent()
    
        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
    
        let option1 = await rendered.findByText('si')
        let option2 = await rendered.findByText('no')
        let tokenInput = await rendered.findByTestId('table_token_field')
        let votingDescription = await rendered.findByText('testing description')
        let votingBtn = await rendered.findByText('Enviar votación')
        let cannotVoteBtn = rendered.queryByText("No puedes votar ahora mismo")

        expect(option1).toBeInTheDocument() 
        expect(option2).toBeInTheDocument()
        expect(tokenInput).toBeInTheDocument()
        expect(votingBtn).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()
        expect(cannotVoteBtn).not.toBeInTheDocument()
    
        await act(async ()=> {
            await fireEvent.click(option1)
            await fireEvent.click(votingBtn)
        })
        
        let emptyTableTokenSnackBar = await rendered.findByText("El token no puede estar vacío")
        let closeButton = await rendered.findByTitle("Close")

        expect(emptyTableTokenSnackBar).toBeInTheDocument()
        expect(closeButton).toBeInTheDocument()

        await act(async ()=> {
            await fireEvent.click(closeButton)
        })

        promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let aux = await rendered.queryByText("El token no puede estar vacío")

        expect(aux).not.toBeInTheDocument()
    })
})


describe('Behaviour tests suite', () => {
    it('Correct radio change', async () => {
        let rendered = null
    
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
    
        rendered = renderComponent()
    
        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        
        let option1 = await rendered.findByText('si')
        let option2 = await rendered.findByText('no')
        let votingDescription = await rendered.findByText('testing description')
        let votingBtn = await rendered.findByText('Enviar votación')
        let cannotVoteBtn = rendered.queryByText("No puedes votar ahora mismo")
    
        expect(option1).toBeInTheDocument() 
        expect(option2).toBeInTheDocument()
        expect(votingBtn).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()
        expect(cannotVoteBtn).not.toBeInTheDocument()
    
        expect(fireEvent.click(option1).valueOf()).toBe(true)
    })

    it('Success voting an option', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        mockAxios.onPost().replyOnce(200)
    
        rendered = renderComponent()
    
        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
    
        let option1 = await rendered.findByText('si')
        let option2 = await rendered.findByText('no')
        let votingDescription = await rendered.findByText('testing description')
        let votingBtn = await rendered.findByText('Enviar votación')
        let cannotVoteBtn = rendered.queryByText("No puedes votar ahora mismo")
        let tokenInput = await rendered.findByTestId('table_token_field')

        expect(option1).toBeInTheDocument() 
        expect(option2).toBeInTheDocument()
        expect(votingBtn).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()
        expect(cannotVoteBtn).not.toBeInTheDocument()
        expect(tokenInput).toBeInTheDocument()
    
        await act(async ()=> {
            await fireEvent.click(option1)
            await fireEvent.change(tokenInput.children[1].children[0], {target: {value: 'tokenInventado'}})
            await fireEvent.click(votingBtn)
        })

        expect(tokenInput.children[1].children[0].value).toBe('tokenInventado')

        let successSnackBar = await rendered.findByText("¡Ha votado correctamente!")

        expect(successSnackBar).toBeInTheDocument()
    })

    it('Failure voting an option', async () => {
        let rendered = null

        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        mockAxios.onPost().replyOnce(400, {})
    
        rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
    
        let option1 = await rendered.findByText('si')
        let option2 = await rendered.findByText('no')
        let tokenInput = await rendered.findByTestId('table_token_field')
        let votingDescription = await rendered.findByText('testing description')
        let votingBtn = await rendered.findByText('Enviar votación')
        let cannotVoteBtn = rendered.queryByText("No puedes votar ahora mismo")

        expect(option1).toBeInTheDocument() 
        expect(option2).toBeInTheDocument()
        expect(tokenInput).toBeInTheDocument()
        expect(votingBtn).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()
        expect(cannotVoteBtn).not.toBeInTheDocument()

        await act(async ()=> {
            await fireEvent.click(option1)
            await fireEvent.change(tokenInput.children[1].children[0], {target: {value: 'tokenInventado'}})
            await fireEvent.click(votingBtn)
        })
        
        let failureVotingSnackBar = await rendered.findByText("Ups, ha habido un error al votar... Inténtalo de nuevo")

        expect(failureVotingSnackBar).toBeInTheDocument()
    })
    
})
