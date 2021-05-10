import { useCallback, useContext, useState } from "react";
import Context from '../context/UserContext'
import * as authService from '../services/auth'
import { useHistory } from 'react-router'

export default function useUser() {
    const { auth, setAuth, currentBar, setCurrentBar } = useContext(Context)
    const [state, setState] = useState({ loading: false, error: false })
    const [isUpdate, setUpdate] = useState(false)
    
    const history = useHistory()

    const login = useCallback(({ username, password }) => {
        setState({ loading: true, error: false })
        authService.login({ username, password })
            .then(user => {
                window.localStorage.setItem('user', JSON.stringify(user))
                setState({ loading: false, error: false })
                setAuth(user)
            })
            .catch(err => {
                window.localStorage.removeItem('user')

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
                history.push({
                    pathname: '/login',
                    search: '?registered=true'
                })
            })
            .catch(err => {
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

    const updateBraintreeData = useCallback((braintreeData) => {
        setState({ loading: true, error: false })
        authService.updateBraintreeData(braintreeData)
            .then(() => {
                let user = JSON.parse(window.localStorage.getItem('user'))
                user.braintreeMerchantId = braintreeData.merchantId
                user.braintreePublicKey = braintreeData.publicKey
                user.braintreePrivateKey = braintreeData.privateKey
                window.localStorage.setItem('user', JSON.stringify(user))
                setUpdate(true)
            })
            .catch((err) => {
                setUpdate(false)
                if (err.response?.status === 400) {
                    setState({loading: false, error: "Los datos no se han enviado correctamente"})
                } else if (err.response?.status === 403) {
                    setState({loading: false, error: "No autorizado"})
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [history])

    const checkToken = useCallback(() => {
        // setState({ loading: true, error: false })
        authService.checkToken()
            .then(() => {
                // setState({ loading: false, error: false })
            })
            .catch((err) => {
                window.localStorage.removeItem('user')
                setAuth(null)
                // setState({ loading: false, error: "Token expirado" })
            })
    }, [setAuth])

    const logout = useCallback(() => {
        history.push("/")
        window.localStorage.removeItem('user')
        setAuth(null)
    }, [setAuth, history])
 
    const updateCurrentBar = useCallback((bar) => {
        setCurrentBar(bar)
    }, [setCurrentBar])

    return {
        isLogged: Boolean(auth),
        isUpdate,
        login,
        signup,
        update,
        logout,
        auth,
        currentBar,
        updateCurrentBar,
        updateBraintreeData,
        checkToken,
        error: state.error
    }

}