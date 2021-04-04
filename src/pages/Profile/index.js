import React from "react";
import useUser from "../../hooks/useUser";
import { useHistory } from 'react-router'

export default function Profile() {
    const { isLogged, auth } = useUser()
    const history = useHistory()

    if (!isLogged) {
        history.push('/')
        return null
    }

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>{auth.username}</strong> Perfil
                </h3>
            </header>
            <p>
                <strong>Token:</strong>{" "}
                {auth.accessToken.substring(0, 20)} ...{" "}
                {auth.accessToken.substr(auth.accessToken.length - 20)}
            </p>
            <p>
                <strong>Email:</strong>{" "}
                {auth.email}
            </p>
            <strong>Roles:</strong>
            <ul>
                {auth.roles &&
                    auth.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
        </div>
    );

}