import React from 'react';
import { act, render, fireEvent } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import CreateVotings from '../pages/VotingCreate';
import http from "../http-common";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';

// Hide warning
console.error = () => {
    //necessary empty
 }

const setAuth = jest.fn()
const mockAxios = new MockAdapter(http)
const history = createMemoryHistory()
history.push = jest.fn();


const admin = {
    username: "test-admin",
    email: "test@admin.com",
    roles: ["ROLE_OWNER"],
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LWFkbWluIiwiaWF0IjoxNjE3NDUwNzk0LCJleHAiOjE2MTc1MzcxOTR9.KhlzaCxWGb25NHgJ557N1L6ETwNdTOqrKJ1s4cnBG7L2rZFEWLnbhizLJ5LizHxUqGxqrps3NU-gx-l6FyozRg"
}

function renderCreateVotingAdmin(auth) {
    return render(
        <Context.Provider value={{ auth, setAuth }}>
            <Router history={history} >
                <CreateVotings  {...{ match: { params: { idBar: 1 }}}} history={history}/>
            </Router>
        </Context.Provider>
        )
}


describe('Testing create voting', () => {

    it('Render form with correct text admin', async () => {
        let rendered = renderCreateVotingAdmin(admin)
        

        let header = await rendered.findByText('Creación de votación')
        let title = await rendered.findByText('Título')
        let description = await rendered.findAllByText('Descripción')
        let openingHour = await rendered.findByText('Fecha de inicio')
        let closingHour = await rendered.findByText('Fecha de fin')
        let options = await rendered.findByText('Opciones')
        let add = await rendered.findByText('Añadir')
        let del = await rendered.findByText('Eliminar')
        let send = await rendered.findByText('Enviar')

        expect(header).toBeInTheDocument()
        expect(title).toBeInTheDocument()
        expect(description).toHaveLength(2)
        expect(openingHour).toBeInTheDocument()
        expect(closingHour).toBeInTheDocument()
        expect(options).toBeInTheDocument()
        expect(add).toBeInTheDocument()
        expect(del).toBeInTheDocument()
        expect(send).toBeInTheDocument()

    })

    it('Inputs without options correct', async () => {
        let rendered = renderCreateVotingAdmin(admin)

        let title = await rendered.getByRole('textbox', { name: /Título/i })
        fireEvent.change(title, { target: { value: 'Votación' } })
        expect(title.value).toBe('Votación')

        let description = await rendered.container.querySelector('#description');
        fireEvent.change(description, { target: { value: 'Descripción de la votación' } })
        expect(description.value).toBe('Descripción de la votación')

        let opening = await rendered.container.querySelector('#opening');
        fireEvent.change(opening, { target: { value: '04-12-2021 10:50:38' } })
        expect(opening.value).toBe('04-12-2021 10:50:38')

        let closing = await rendered.container.querySelector('#closing');
        fireEvent.change(closing, { target: { value: '06-12-2021 12:50:38' } })
        expect(closing.value).toBe('06-12-2021 12:50:38')

    })

    it('Inputs without options incorrect', async () => {
        let rendered = renderCreateVotingAdmin(admin)

        let opening = await rendered.container.querySelector('#opening');
        fireEvent.change(opening, { target: { value: '' } })
        expect(opening.value).toBe('')

        let errorOpen = await rendered.findByText('La fecha no puede estar en pasado')
        expect(errorOpen).toBeInTheDocument()

        fireEvent.change(opening, { target: { value: '04-01-2021 11:57:34' } })
        expect(errorOpen).toBeInTheDocument()

        let closing = await rendered.container.querySelector('#closing');
        fireEvent.change(closing, { target: { value: '05-01-2021 12:50:38' } })
        let error1Close = await rendered.findByText('La fecha de fin no puede estar en pasado')
        expect(error1Close).toBeInTheDocument()

        fireEvent.change(closing, { target: { value: '01-01-2021 12:50:38' } })
        let error2Close = await rendered.findByText('La fecha de fin no puede ser anterior a la de inicio')
        expect(error2Close).toBeInTheDocument()

        fireEvent.change(opening, { target: { value: '04-12-2021 11:57:34' } })
        expect(errorOpen).not.toBeInTheDocument()

    })

    it('Options inputs correct', async () => {
        let rendered = renderCreateVotingAdmin(admin)

        let add = await rendered.getByRole('button', { name: /Añadir/i })      
        fireEvent.click(add);
        let option1 = await rendered.container.querySelector('#option1');
        expect(option1).toBeInTheDocument()
        
        fireEvent.click(add);
        let option2 = await rendered.container.querySelector('#option2');
        expect(option2).toBeInTheDocument()

        let del = await rendered.getByRole('button', { name: /Eliminar/i })
        fireEvent.click(del);
        expect(option2).not.toBeInTheDocument()

    })

    it('Correct submit', async () => {
        mockAxios.onPost().replyOnce(201)

        let rendered = renderCreateVotingAdmin(admin)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let title = await rendered.getByRole('textbox', { name: /Título/i })
        fireEvent.change(title, { target: { value: 'Votación' } })

        let description = await rendered.container.querySelector('#description');
        fireEvent.change(description, { target: { value: 'Descripción de la votación' } })

        let opening = await rendered.container.querySelector('#opening');
        fireEvent.change(opening, { target: { value: '4-12-2021 1:5:3' } })

        let closing = await rendered.container.querySelector('#closing');
        fireEvent.change(closing, { target: { value: '06-12-2021 12:50:38' } })

        let add = await rendered.getByRole('button', { name: /Añadir/i })
        fireEvent.click(add);
        let option1 = await rendered.container.querySelector('#option1');
        fireEvent.change(option1, { target: { value: 'Descripción de la opción' } })

        let send = await rendered.getByRole('button', { name: /Enviar/i })        
        
        await act(async () => {
            fireEvent.click(send)
        })
        let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
        expect(errorSubmit).not.toBeInTheDocument()

    })

    it('Incorrect submit', async () => {
        mockAxios.onPost().replyOnce(201)

        let rendered = renderCreateVotingAdmin(admin)

        let promise = new Promise(r => setTimeout(r, 2500));
        await act(() => promise)

        let title = await rendered.getByRole('textbox', { name: /Título/i })
        fireEvent.change(title, { target: { value: '' } })

        let description = await rendered.container.querySelector('#description');
        fireEvent.change(description, { target: { value: '' } })

        let opening = await rendered.container.querySelector('#opening');
        fireEvent.change(opening, { target: { value: '04-01-2021 10:50:38' } })
        let pastOpening = await rendered.queryByText('La fecha no puede estar en pasado')
        expect(pastOpening).toBeInTheDocument()

        let closing = await rendered.container.querySelector('#closing');
        fireEvent.change(closing, { target: { value: '0' } })
        let nullClosing = await rendered.queryByText('La fecha no es válida')
        expect(nullClosing).toBeInTheDocument()

        fireEvent.change(closing, { target: { value: '01-01-2021 12:50:38' } })
        let pastClosing = await rendered.queryByText('La fecha de fin no puede ser anterior a la de inicio')
        expect(pastClosing).toBeInTheDocument()

        fireEvent.change(closing, { target: { value: '01-04-2021 12:50:38' } })
        let beforeClosing = await rendered.queryByText('La fecha de fin no puede estar en pasado')
        expect(beforeClosing).toBeInTheDocument()
        
        fireEvent.change(opening, { target: { value: '0' } })
        let nullOpening = await rendered.queryByText('Fecha no válida')
        expect(nullOpening).toBeInTheDocument()

        let add = await rendered.getByRole('button', { name: /Añadir/i })
        fireEvent.click(add);
        let option1 = await rendered.container.querySelector('#option1');
        fireEvent.change(option1, { target: { value: '' } })

        let send = await rendered.getByRole('button', { name: /Enviar/i })

        await act(async () => {
            fireEvent.click(send)
        })

        let errorSubmit = await rendered.queryByText('Tienes que rellenar el formulario correctamente')
        expect(errorSubmit).toBeInTheDocument()


        let validatorText = await rendered.queryAllByText('No puede estar vacío')
        expect(validatorText).toHaveLength(3)
    })

    it('Options buttons incorrect', async () => {
        let rendered = renderCreateVotingAdmin(admin)

        let add = await rendered.getByRole('button', { name: /Añadir/i })
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);
        fireEvent.click(add);

        let errorAdd = await rendered.queryByText('No puedes crear o eliminar más opciones')
        expect(errorAdd).toBeInTheDocument()


    })
})