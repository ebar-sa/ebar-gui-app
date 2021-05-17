import React from 'react';
import { Router } from 'react-router-dom';
import { act, render } from "@testing-library/react";
import { makeStyles } from '@material-ui/core/styles';

import { createMemoryHistory } from 'history';
import Context from '../context/UserContext';
import Header from '../components/Header';
import userEvent from '@testing-library/user-event';

const setAuth = jest.fn()
const history = createMemoryHistory()

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

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: '1',
        overflowY: 'auto',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        color: 'white',
        backgroundImage: 'linear-gradient(45deg, #006e85 30%, #00cca0 90%)'
    },
    appBarShift: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        flexGrow: 1,
    },
    colorBar: {
        backgroundColor: 'white',
    },
}))

describe('Header test suite', () => {

    it('Render header', async () => {

        const mProps = { history: { push: jest.fn() } };

        let rendered = render(
            <Context.Provider value={{ auth, setAuth }}>
                <Router history={history}>
                    <Header {...mProps} classes={useStyles}/>
                </Router>
            </Context.Provider>)

        let promise = new Promise(r => setTimeout(r, 250));
        await act(() => promise)

        let profile = await rendered.findByText('Perfil')
        let subs = await rendered.findByText('Mis suscripciones')
        let aria = await rendered.getByLabelText('account of current user')
        expect(profile).toBeInTheDocument()
        expect(subs).toBeInTheDocument()
        expect(aria).toBeInTheDocument()
        userEvent.click(aria)
    })
})