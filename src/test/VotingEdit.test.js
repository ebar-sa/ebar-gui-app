import React from 'react';
import { act, render, fireEvent, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import VotingEdit from '../pages/VotingEdit';
import http from "../http-common";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()
history.push = jest.fn();

const auth = {username:"client1",
    email:"cliente1@email.es",
    roles:["ROLE_OWNER"],
    tokenType:"Bearer",
    accessToken:"AnyToken"
}


const barList = {
    "id": 99,
    "name": "Burger Food Porn",
    "capacity": "7/11",
    "owner": "client1",
    "employees": [{}]
}

const correctVotingDummy = {
    id: 99,
    title: "example voting",
    description: "testing description",
    openingHour: "01-07-2023 23:00:00",
    closingHour: "01-07-2023 23:59:00",
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

const begunVotingDummy = {
    id: 99,
    title: "example voting",
    description: "testing description",
    openingHour: "01-07-2020 23:00:00",
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
    openingHour: "01-07-2020 23:00:00",
    closingHour: "01-07-2020 23:59:00",
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

function renderComponent() {
    return render(
        <Context.Provider value={{auth, setAuth}}>
            <Router history={history} >
                <VotingEdit {...{match: {params: {votingId: 99, barId: 99}}}}/>
            </Router>
        </Context.Provider>)
}

describe('Testing render component correctly', () => {

    it('Render form with correct inital data', async() => {

        
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        let rendered = renderComponent()
        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        
        let option1 = await rendered.findByTestId('option1')
        let option2 = await rendered.findByTestId('option2')
        let votingDescription = await rendered.findByText('testing description')
        let editButton = await rendered.findByText('Editar votación')
        let openingHour = await rendered.findByTestId('openingField')
        let closingHour = await rendered.findByTestId('closingField')

        expect(option1).toBeInTheDocument()
        expect(option2).toBeInTheDocument()
        expect(votingDescription).toBeInTheDocument()
        expect(editButton).toBeInTheDocument()
        expect(openingHour).toBeInTheDocument()
        expect(closingHour).toBeInTheDocument()
        expect(option1.children[1].children[0].value).toBe('si')
        expect(openingHour.children[1].children[0].value).toBe('01-07-2023 23:00:00')
        expect(closingHour.children[1].children[0].value).toBe('01-07-2023 23:59:00')
        
    }, [7000])

    it('Render component with an already began voting', async () => {

        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, begunVotingDummy)
        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let alreadyBegunAlert = await rendered.findByText('No puedes editar votaciones ya comenzadas')
        expect(alreadyBegunAlert).toBeInTheDocument()
        
    })

    it('Render component with a closed voting', async () => {
        
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, closedVotingDummy)
        
        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)
        screen.debug()
        let alreadyBegunAlert = await rendered.findByText('No puedes editar votaciones ya comenzadas')
        expect(alreadyBegunAlert).toBeInTheDocument()
        
    })
})

describe('Behaviour testing', () => {
    
    it('Changing fields', async () => {
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        
        mockAxios.onPut().replyOnce(200)

        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let descriptionField = await rendered.findByText('testing description')
        let titleField = await rendered.findByTestId('titleField')
        let closingField = await rendered.findByTestId('closingField')
        let openingField = await rendered.findByTestId('openingField')

        await act(async () => {
            await fireEvent.change(descriptionField, {target: {value: 'testing description edited'}} )
            await fireEvent.change(titleField.children[1].children[0], {target: {value: 'example voting edited'}})
            await fireEvent.change(openingField.children[1].children[0], {target: {value: "30-06-2023 10:50:30"}})
            await fireEvent.change(closingField.children[1].children[0], {target: {value: "04-08-2023 04:00:00"}})
        })

        descriptionField = await rendered.findByText('testing description edited')
        titleField = await rendered.findByTestId('titleField')
        openingField = await rendered.findByTestId('openingField')
        closingField = await rendered.findByTestId('closingField')

        expect(openingField.children[1].children[0].value).toBe("30-06-2023 10:50:30")
        expect(closingField.children[1].children[0].value).toBe("04-08-2023 04:00:00")
        expect(descriptionField).toBeInTheDocument()
        expect(titleField.children[1].children[0].value).toBe('example voting edited')

    }, [7000])

    it('Deleting an option', async () => {
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
       
        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let option1 = await rendered.findByTestId('option1')
        let option2 = await rendered.findByTestId('option2')
        expect(option1.children[1].children[0].value).toBe('si')
        expect(option2.children[1].children[0].value).toBe('no')

        let deleteButton = await rendered.findByText('Eliminar')

        await act(async () => {
            await fireEvent.click(deleteButton.parentElement.parentElement)  
        })

        option1 = await rendered.queryByTestId('option1')
        option2 = await rendered.queryByTestId('option2')
        expect(option1.children[1].children[0].value).toBe('si')
        expect(option2).not.toBeInTheDocument()

    }, [7000])

    it('Adding an option',async () => {
        
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        
        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let option1 = await rendered.findByTestId('option1')
        let option2 = await rendered.findByTestId('option2')
        let option3 = await rendered.queryByTestId('option3')
        expect(option3).not.toBeInTheDocument()
        expect(option1.children[1].children[0].value).toBe('si')
        expect(option2.children[1].children[0].value).toBe('no')

        let deleteButton = await rendered.findByText('Añadir')

        await act(async () => {
            await fireEvent.click(deleteButton.parentElement.parentElement)  
        })

        option1 = await rendered.queryByTestId('option1')
        option2 = await rendered.queryByTestId('option2')
        option3 = await rendered.queryByTestId('option3')
        expect(option1.children[1].children[0].value).toBe('si')
        expect(option2.children[1].children[0].value).toBe('no')
        expect(option3.children[1].children[0].value).toBe('')

    }, [7000])

    it('Clicking success edit button', async () => {
        
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        
        mockAxios.onPut().replyOnce(200)
        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let editButton = await rendered.findByText('Editar votación')
        let descriptionField = await rendered.findByText('testing description')
        let titleField = await rendered.findByTestId('titleField')

        await act(async () => {
            await fireEvent.change(descriptionField, {target: {value: 'testing description edited'}} )
            await fireEvent.change(titleField.children[1].children[0], {target: {value: 'example voting edited'}})
            await fireEvent.click(editButton)
        })

        let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
        expect(errorSubmit).not.toBeInTheDocument()

    }, [7000])

    it('Testing validators', async () => {
        
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        
        mockAxios.onPut().replyOnce(200)

        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let descriptionField = await rendered.findByText('testing description')
        let titleField = await rendered.findByTestId('titleField')
        let closingField = await rendered.findByTestId('closingField')
        let openingField = await rendered.findByTestId('openingField')
        let editButton = await rendered.findByText('Editar votación')
        let deleteButton = await rendered.findByText('Eliminar')

        await act(async () => {
            await fireEvent.change(descriptionField, {target: {value: ''}} )
            await fireEvent.change(titleField.children[1].children[0], {target: {value: ''}})
            await fireEvent.change(openingField.children[1].children[0], {target: {value: ""}})
            await fireEvent.change(closingField.children[1].children[0], {target: {value: ""}})
            await fireEvent.click(deleteButton.parentElement.parentElement)  
            await fireEvent.click(deleteButton.parentElement.parentElement)  
            await fireEvent.click(editButton)
        })

        let errorMessage1 = await rendered.findByText('Tienes que rellenar el formulario correctamente')
        let errorMessage2 = await rendered.findAllByText('No puede estar vacío')
        let errorMessage3 = await rendered.findAllByText('Fecha no válida')

        expect(errorMessage1).toBeInTheDocument()
        expect(errorMessage2.length).toBe(2)
        expect(errorMessage3.length).toBe(2)

    }, [7000])

    it('Testing date validator closing before opening', async () => {
        
        mockAxios.onGet().replyOnce(200, barList)
        mockAxios.onGet().replyOnce(200, correctVotingDummy)
        
        let rendered = renderComponent()

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let closingField = await rendered.findByTestId('closingField')
        let openingField = await rendered.findByTestId('openingField')

        await act(async () => {
            await fireEvent.change(openingField.children[1].children[0], {target: {value: "21-04-2025 22:00:00"}})
            await fireEvent.change(closingField.children[1].children[0], {target: {value: "21-04-2025 19:00:00"}})

        })

        let errorMessage1 = await rendered.findByText('La fecha de fin no puede ser anterior a la de inicio')
      
        expect(errorMessage1).toBeInTheDocument()
    }, [6000])
    
})