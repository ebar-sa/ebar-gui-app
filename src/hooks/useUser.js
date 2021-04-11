import {useCallback, useContext, useState} from "react";
import Context from '../context/UserContext'
import * as authService from '../services/auth'
import {useHistory} from 'react-router'

export default function useUser() {
    const {auth, setAuth} = useContext(Context)
    const [state, setState] = useState({loading: false, error: false})
    const [isRegistered, setRegistered] = useState(false)
    const history = useHistory()

    const login = useCallback(({username, password}) => {
        setState({loading: true, error: false})
        authService.login({username, password})
            .then(user => {
                window.sessionStorage.setItem('user', JSON.stringify(user))
                setState({loading: false, error: false})
                setAuth(user)
            })
            .catch(err => {
                window.sessionStorage.removeItem('user')

                const status = err.response.status
                if (status === 401) {
                    setState({loading: false, error: "Usuario o contraseña incorrectos"})
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [setAuth, history])

    const signup = useCallback(({username, email, roles, password, firstName, lastName, dni, phoneNumber}) => {
        setState({loading: true, error: false})
        authService.register({username, email, roles, password, firstName, lastName, dni, phoneNumber})
            .then(() =>{
                setRegistered(true)
            })
            .catch(err => {
                setRegistered(false)
                if (err.response.status === 400) {
                    setState({loading: false, error: err.response.data.message})
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
        login,
        signup,
        logout,
        auth,
        error: state.error
    }

}