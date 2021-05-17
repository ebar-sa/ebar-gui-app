import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import useUser from '../hooks/useUser'


const PrivateRoute = ({ component: Component, ...rest }) => {

    const { auth, checkToken } = useUser()

    function checkTokenIsValid(props) {
        checkToken()
        if (auth) {
            return <Component {...props} />
        } else {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
    }

    return (
        <Route
            {...rest}
            render={props => checkTokenIsValid(props)}
        />
    )
}

export default PrivateRoute