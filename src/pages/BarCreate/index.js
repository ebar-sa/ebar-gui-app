import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import useUser from "../../hooks/useUser";
import BarForm from "../../components/bar-form.component";

export default function CreateBar() {

    const history = useHistory()
    const { auth } = useUser()
    const admin = auth.roles.includes('ROLE_OWNER')

    useEffect(() => {
        if (!admin) history.push('/profile')
    }, [admin, history])

    return (
        <BarForm bar={{
            name: '',
            description: '',
            location: '',
            contact: ''
        }} openingTime={new Date()} closingTime={new Date()} type="create" history={history} />
    )


}