import { useCallback, useContext, useState } from "react";
import Context from '../context/UserContext'
import * as authService from '../services/auth'

export default function useUser () {
    const {auth, setAuth} = useContext(Context)
    const [state, setState] = useState({loading: false, error: false})

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
                setState({loading: false, error: err.response.data.error})
            })
        }, [setAuth])
    
    const logout = useCallback(() => {
        window.sessionStorage.removeItem('user')
        setAuth(null)
    }, [setAuth])

    return {
        isLogged: Boolean(auth),
        login,
        logout,
        auth,
        error: state.error
    }
    
}