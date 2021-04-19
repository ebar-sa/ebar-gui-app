import {useCallback, useContext, useState} from "react";
import Context from '../context/UserContext'
import * as employeeService from '../services/employee'
import {useHistory} from 'react-router'

export default function useEmployee() {
    const {auth} = useContext(Context)
    const [state, setState] = useState({loading: false, error: false})
    const history = useHistory()

    const createemployee = useCallback((idBar,{username, email, roles, password, firstName, lastName, dni, phoneNumber}) => {
        setState({loading: true, error: false})
        employeeService.createEmployees(idBar,{username, email, roles, password, firstName, lastName, dni, phoneNumber})
            .then(() =>{
                history.push("/bar/"+idBar+"/employees")
            })
            .catch(err => {
                if (err.response.status === 400) {
                    setState({loading: false, error: err.response.data.message})
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [history])

    const updateemployee = useCallback((idBar,user,{username, email, roles, firstName, lastName, dni, phoneNumber}) => {
        setState({loading: true, error: false})
        employeeService.updateEmployees(idBar,user,{username, email, roles, firstName, lastName, dni, phoneNumber})
            .then(() =>{
                history.push("/bar/"+idBar+"/employees")
            })
            .catch(err => {
                if (err.response.status === 400) {
                    setState({loading: false, error: err.response.data.message})
                } else {
                    history.push("/pageNotFound")
                }
            })
    }, [history])

    return {
        isLogged: Boolean(auth),
        createemployee,
        updateemployee,
        auth,
        error: state.error
    }

}