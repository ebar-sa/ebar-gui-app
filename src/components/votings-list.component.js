import React, { useEffect, useState } from 'react';
import events from '../img/even.jpg'
import { List, ListItem, ListItemText, Collapse, Button } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styles from '../styles/votations.css'
import VotationDataService from "../services/votations.service";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import AddIcon from '@material-ui/icons/Add';

function Votings() {

    const [votations, setVotations] = useState([])
    const [expanded, setExpanded] = useState({});
    const [time, setTime] = useState(new Date());
    const username = AuthService.getCurrentUser().username
    const roles = AuthService.getCurrentUser().roles
    const admin = roles.includes('ROLE_OWNER') || roles.includes('ROLE_EMPLOYEE');

    console.log('Roles', roles)

    const handleClick = (id) => {
        setExpanded({
            ...expanded,
            [id]: !expanded[id]
        });
    }

    useEffect(() => {
        VotationDataService.getVotations().then(res => {
            console.log(res)
            setVotations(res)
        }).catch(err => {
            console.log('Error', err.response.status)
        })
    }, [])

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 60000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <div className='container'>
                <img className='img' alt="events" src={events} />
                <div className="div-vot">Votaciones</div>
            </div>
            <div>
                {admin ? 
                <div className="header">
                    <Link to={"/votations/votation/create"}>
                        <Button variant="contained" color="primary" style={{ ...stylesComponent.buttonCrear }} startIcon={<AddIcon />}>
                            Crear votación
                        </Button>
                    </Link>
                </div> : 
                    <h5>
                        A continuación, podrá encontrar la lista de votaciones disponibles en las que puede participar
                    </h5>}
            </div>
            <div className='div-list'>
                <h5>Votaciones finalizadas</h5>
                <List component="nav">
                    {votations.filter(x => {
                        const endDate = new Date(x.closingHour)
                        return (time>endDate)
                    }).map(x => 
                    <div key={x.id}>
                        <ListItem button onClick={() => handleClick(x.id)} style={{ ...stylesComponent.listitem }}>
                            <ListItemText disableTypography style={{ ...stylesComponent.listItemText1 }} primary={x.title} />
                            {!expanded[x.id] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={expanded[x.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding style={{ ...stylesComponent.listdetail }}>
                                <ListItem>
                                    <ListItemText disableTypography style={{ ...stylesComponent.listItemText2 }}>
                                        <p>{x.description}</p>
                                        <p style={{fontWeight:'600', textDecoration: 'underline'}}>Resultados</p>
                                        {x.options.map(y => {
                                            return <p key={y.id}>{y.description}: {y.votes} votos</p  >
                                        })}
                                        </ListItemText>
                                </ListItem>
                            </List>
                        </Collapse>
                    </div>)
                    }
                </List>

                <h5>Votaciones en curso</h5>
                <List component="nav">
                    {votations.filter(x => {
                        const openDate = new Date(x.openingHour)
                        const endDate = new Date(x.closingHour)
                        return (time < endDate && time>openDate)
                    }).map(x => 
                        <div key={x.id}>
                            <ListItem button onClick={() => handleClick(x.id)} style={{ ...stylesComponent.listitem }}>
                                <ListItemText disableTypography style={{ ...stylesComponent.listItemText1 }} primary={x.title} />
                                {admin ? 
                                    <Link to={"/votations/votation/" + x.id}>
                                        <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAcceder }} >
                                            Editar
                                    </Button>
                                    </Link>
                                :
                                (!x.votersUsernames.includes(username) ? <Link to={"/votations/votation/" + x.id}>
                                    <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAcceder }} >
                                        Acceder
                                    </Button>
                                </Link> : null)}
                                {!expanded[x.id] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={expanded[x.id]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding style={{ ...stylesComponent.listdetail }}>
                                    <ListItem>
                                        <ListItemText disableTypography style={{ ...stylesComponent.listItemText2 }}>
                                            <p>{x.description}</p>
                                            <p className='p'>Fecha fin: 22/05/2021 23:45</p>
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </div>
                    )}
                </List>
            </div>
        </div>
    )
}

const stylesComponent = {

    buttonCrear: {
        backgroundColor: '#007bff',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600'
    },
    buttonAcceder: {
        backgroundColor: '#007bff',
        marginRight: '60px',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600'
    },
    listdetail: {
        backgroundColor: 'rgba(215, 211, 211, 0.3)',
        borderRadius: '5px',
        marginTop: '3px'
    },
    listitem: {
        backgroundColor: 'rgba(215, 211, 211, 0.74)',
        borderRadius: '5px',
        height: '55px',
        marginTop: '3px'
    },
    listItemText1: {
        fontSize: '18px'
    },
    listItemText2: {
        marginTop: '10px'
    }
}

export default Votings