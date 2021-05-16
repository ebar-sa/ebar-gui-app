import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import {Grid, useMediaQuery} from '@material-ui/core'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Mesa from '../../components/Mesa'
import {useHistory} from 'react-router'
import {getTables} from '../../services/bartable'
import {getCurrentUser} from '../../services/auth'
import Container from "@material-ui/core/Container";
import Footer from "../../components/Footer";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '5rem',
        marginBottom:"20%"
    },
    rootPhone: {
        marginBottom:"20%"
    },
}))

export default function Mesas(props) {
    const user = getCurrentUser()
    const classes = useStyles()
    const [tables, setTables] = useState([])
    const params = useParams()
    const id = params.barId
    const history = useHistory()
    const theme = useTheme();
    const phoneScreen = useMediaQuery(theme.breakpoints.down('sm'));
    var isAdmin =
        user.roles.includes('ROLE_OWNER') || user.roles.includes('ROLE_EMPLOYEE')
    const barId = props.match.params.barId
    useEffect(() => {
        getTables(barId)
            .then((res) => setTables(res))
            .catch((err) => {
                if (err.response?.status === 402) {
                    history.push(`/payments/subscribe/${barId}`)
                } else {
                    console.log('Error: ' + err)
                    history.push('/pageNotFound')
                }
            })
    }, [barId, history])
    useEffect(() => {
        if (!isAdmin) {
            history.push('/')
        }
    }, [isAdmin, history])

    return (
        <div style={{marginBottom:"30px"}}>
            <Container className={phoneScreen? classes.rootPhone : classes.root} maxWidth={"lg"}>
                <h1>Mesas</h1>
                <Grid container spacing={3}>
                    {tables.map((table) => (
                        <Grid item xs={12} sm={6} md={6} key={table.id}>
                            <Mesa {...table} isAdmin={isAdmin} idBar={id}/>
                        </Grid>
                    ))}
                    {isAdmin &&
                        <Grid item container xs={12}>
                            <ButtonGroup
                                fullWidth={true}
                                color="primary"
                                aria-label="outlined primary button group"
                                className={classes.buttons}
                            >
                                <Button href={`/#/mesas/${id}/create`}>Crear Mesa</Button>
                                <Button href={`/#/bares/${barId}`}>Volver</Button>
                            </ButtonGroup>
                        </Grid>
                    }
                </Grid>
            </Container>
            <Footer/>
        </div>
    )
}
