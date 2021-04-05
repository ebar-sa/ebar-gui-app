import { useCallback, useContext, useState } from "react";
import Context from '../context/UserContext'
import * as authService from '../services/auth'
import { useHistory } from 'react-router'
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
                try {
                    setState({loading: false, error: err.response.data.error})
                } catch (e) {
                    setState({loading: false, error: "Connection error"})
                }
            })
        }, [setAuth])
    const history = useHistory()
    const logout = useCallback(() => {
        history.push("/")  
        window.sessionStorage.removeItem('user')
        setAuth(null)
    }, [setAuth,history])

    return {
        isLogged: Boolean(auth),
        login,
        logout,
        auth,
        error: state.error
    }
    
}