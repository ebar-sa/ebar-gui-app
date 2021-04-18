import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import useUser from "../../hooks/useUser";
import BarForm from "../../components/bar-form.component";
import BarDataService from "../../services/bar.service";

export default function UpdateBar(props) {

    const [bar, setBar] = useState({
        name: '',
        description: '',
        location: '',
        contact: ''
    });
    const history = useHistory()
    const { auth } = useUser()
    const barId = props.match.params.barId;


    useEffect(() => {
        BarDataService.getBar(barId).then(res => {
            if (res.status === 200) {
                if (auth.username !== res.data.owner) {
                    history.push('/profile')
                } else {
                    setBar(res.data)
                }
            }
        }).catch(error => {
            console.log("Error: " + error)
            history.push('/pageNotFound')
        })

    }, [auth, barId, history])

    return(
        <BarForm bar={bar} openingTime={bar.openingTime === undefined ?
                new Date().getTime() :
                new Date(bar.openingTime)}
            closingTime={bar.closingTime === undefined ?
                new Date().getTime() + 1 :
                new Date(bar.closingTime)}
            type="update"
            barId={barId}
            history={props.history}/>
    )


}