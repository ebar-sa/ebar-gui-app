import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Collapse, Button, Snackbar, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import VotingDataService from "../../services/votings.service";
import { Link } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import useUser from '../../hooks/useUser'
import '../../styles/votings.css'


function Votings(props) {

    const [votings, setVotings] = useState([])
    const [expanded, setExpanded] = useState({});
    const [time, setTime] = useState(new Date());
    const { auth } = useUser()
    const username = auth.username
    const roles = auth.roles
    const admin = roles.includes('ROLE_OWNER') || roles.includes('ROLE_EMPLOYEE');
    const [data, setData] = useState(false)
    const [openVal, setOpenVal] = useState(false)

    const handleClick = (id) => {
        setExpanded({
            ...expanded,
            [id]: !expanded[id]
        });
    }

    useEffect(() => {
        VotingDataService.getVotingsByBarId().then(res => {
            setVotings(res)
        }).catch(err => {
            setOpenVal(true)
            console.log('Error', err)
        })
    }, [])

    useEffect(() => {
        setData(typeof props.history.location.state !== 'undefined' ? true : false)
        const interval = setInterval(() => setTime(Date.now()), 60000);
        return () => {
            clearInterval(interval);
        };
    }, [props.history.location.state]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setData(false)    
        setOpenVal(false)    
    };

    const formatDate = (date) => {
        const closeSplit = date.split(' ')
        const date2 = closeSplit[0].split('-')
        const ti2 = closeSplit[1].split(':')
        return ' '+date2[0]+'-'+date2[1]+'-'+date2[2]+' '+ti2[0]+':'+ti2[1]
    }

    const convertDate = (x) => {
        const openSplit = x.openingHour.split(" ");
        const date = openSplit[0].split('-')
        const ti = openSplit[1].split(':')
        const openDate = new Date(date[2], date[1] - 1, +date[0], ti[0], ti[1], ti[2]);
        let closingDate = null

        if (x.closingHour) {
            const closeSplit = x.closingHour.split(' ')
            const date2 = closeSplit[0].split('-')
            const ti2 = closeSplit[1].split(':')
            closingDate = new Date(date2[2], date2[1] - 1, +date2[0], ti2[0], ti2[1], ti2[2]);
        }


        return [openDate, closingDate]
    }

    const getPastDates = (item) => {
        const list = convertDate(item)
        if (time > list[1]) {
            return item;
        }
    }

    const getCurrentDates = (item) => {
        const list = convertDate(item)
        if (time > list[0] && time < list[1]) {
            return item;
        }else if(list[1]===null && time>list[0]){
            return item
        }
    }

    const pastVotings = votings.filter(getPastDates)
    const currentVotings = votings.filter(getCurrentDates)

    return (
        <div className='global'>
            <div className='container'>
                <Typography className='h5' variant="h4" gutterBottom>
                    Votaciones
                </Typography>
            </div>
            <div>
                {admin ?
                    <div className="header">
                        <Link to={"/votings/voting/create"}>
                            <Button variant="contained" color="primary" style={{ ...stylesComponent.buttonCrear }} startIcon={<AddIcon />}>
                                Crear votación
                        </Button>
                        </Link>
                    </div> :
                    <Typography style={{ ...stylesComponent.subtitule }} variant="subtitule1" gutterBottom>
                        A continuación, podrá encontrar la lista de votaciones disponibles en las que puede participar, junto con las finalizadas
                    </Typography>}
            </div>
            <div className='div-list'>
                <Typography className='h5' variant="h6" gutterBottom>
                    Votaciones finalizadas
                </Typography>
                <List component="nav">
                    {pastVotings.length > 0 ? pastVotings.map(x =>
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
                                            {x.options.length > 0 ? 
                                                <div><p style={{ fontWeight: '600', textDecoration: 'underline' }}>Resultados</p> 
                                                <div>{x.options.map(y => 
                                                 <p key={y.id}>{y.description}: {y.votes} votos</p >
                                                )}</div></div> : null}
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Collapse>
                        </div>)
                        : <div className='center'>No existen votaciones finalizadas</div>}
                </List>
                <div className='current'>
                    <Typography className='h5' variant="h6" gutterBottom>
                        Votaciones en curso
                    </Typography>
                    <List component="nav">
                        {currentVotings.length > 0 ? currentVotings.map(x =>
                            <div key={x.id}>
                                <ListItem button onClick={() => handleClick(x.id)} style={{ ...stylesComponent.listitem }}>
                                    <ListItemText disableTypography style={{ ...stylesComponent.listItemText1 }} primary={x.title} />
                                    {admin ?
                                        <Link to={"/"}>
                                            <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAcceder }} >
                                                Editar
                                        </Button>
                                        </Link>
                                        :
                                        (!x.votersUsernames.includes(username) ? <Link to={"/votings/voting/" + x.id}>
                                            <Button variant="contained" size='small' color="primary" style={{ ...stylesComponent.buttonAcceder }} >
                                                Acceder
                                        </Button>
                                        </Link> : <div className='div-voting'>Ya has votado</div>)}
                                    {!expanded[x.id] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={expanded[x.id]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding style={{ ...stylesComponent.listdetail }}>
                                        <ListItem>
                                            <ListItemText disableTypography style={{ ...stylesComponent.listItemText2 }}>
                                                <p>{x.description}</p>
                                                <p className='p'>Fecha fin:  
                                                {x.closingHour === null || x.closingHour === '' ?
                                                ' Indefinida' : formatDate(x.closingHour)}
                                                </p>
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </div>
                        ) : <div className='center'>No existen votaciones en curso</div>}
                    </List>
                </div>
            </div>
            < Snackbar open={data} autoHideDuration={6000} onClose={handleClose} >
                <Alert onClose={handleClose} severity="success">
                    Votación creada con éxito!
                </Alert>
            </Snackbar >
            <Snackbar open={openVal} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    Error obteniendo las votaciones
                </Alert>
            </Snackbar>
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
    },
    subtitule: {
        margin: 'auto', 
        display: 'table',
        fontSize: '16px'
    },
}

export default Votings