import { useCallback, useContext, useState } from "react";
import Context from '../context/UserContext'
import * as authService from '../services/auth'
import { useHistory } from 'react-router'

export default function useUser() {
    const { auth, setAuth } = useContext(Context)
    const [state, setState] = useState({ loading: false, error: false })
    const [isRegistered, setRegistered] = useState(false)
    const [isUpdate, setUpdate] = useState(false)
    const history = useHistory()

    const login = useCallback(({ username, password }) => {
        setState({ loading: true, error: false })
        authService.login({ username, password })
            .then(user => {
                window.sessionStorage.setItem('user', JSON.stringify(user))
                setState({ loading: false, error: false })
                setAuth(user)
            })
            .catch(err => {
                window.sessionStorage.removeItem('user')

                const status = err.response.status
                if (status === 401) {
                    setState({ loading: false, error: "Usuario o contraseña incorrectos." })
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [setAuth, history])

    const signup = useCallback(({ username, email, roles, password, firstName, lastName, dni, phoneNumber }) => {
        setState({ loading: true, error: false })
        authService.register({ username, email, roles, password, firstName, lastName, dni, phoneNumber })
            .then(() => {
                setRegistered(true)
            })
            .catch(err => {
                setRegistered(false)
                if (err.response.status === 400) {
                    let errmessage = err.response.data.message
                    if (!errmessage) {
                        errmessage = "Por favor, revise los datos introducidos e inténtelo de nuevo."
                    }
                    setState({ loading: false, error: errmessage })
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [history])

    const update = useCallback(({ username, email, oldPassword, password, confirmPassword }) => {
        setState({ loading: true, error: false })
        authService.update({ username, email, oldPassword, password, confirmPassword })
            .then(() => {
                setUpdate(true)
            })
            .catch(err => {
                setUpdate(false)
                if (err.response.status === 400) {
                    let errmessage = err.response.data.message
                    if (!errmessage) {
                        errmessage = "Contraseña incorrecta."
                    }
                    setState({ loading: false, error: errmessage })
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [history])

    const logout = useCallback(() => {
        history.push("/")
        window.sessionStorage.removeItem('user')
        setAuth(null)
    }, [setAuth, history])

    return {
        isLogged: Boolean(auth),
        isRegistered,
        isUpdate,
        login,
        signup,
        update,
        logout,
        auth,
        error: state.error
    }

}