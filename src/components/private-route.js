import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import useUser from '../hooks/useUser'


const PrivateRoute = ({ component: Component, ...rest }) => {

    const { auth } = useUser()

    return (
        <Route
            {...rest}
            render={props =>
                auth ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute