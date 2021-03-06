import React, {useEffect, useState} from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Collapse,
    Button,
    Snackbar,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core';
import {ExpandLess, ExpandMore, Add, ArrowRightSharp} from '@material-ui/icons';
import VotingDataService from "../../services/votings.service";
import Alert from '@material-ui/lab/Alert';
import useUser from '../../hooks/useUser'
import '../../styles/votings.css'
import {BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, Cell} from "recharts";
import Footer from '../../components/Footer';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useHistory} from 'react-router';
import BarDataService from "../../services/bar.service";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        textAlign: 'center',
        marginBottom: theme.spacing(9),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }
}));

function Votings(props) {

    const classes = useStyles();
    const history = useHistory()
    const [votings, setVotings] = useState([])
    const [expanded, setExpanded] = useState({});
    const [time, setTime] = useState(new Date());
    const {auth} = useUser()
    const username = auth.username
    const [data, setData] = useState(false)
    const [del, setDel] = useState(false)
    const [edit, setEdit] = useState(false)
    const [openVal, setOpenVal] = useState(false)
    const barId = props.match.params.idBar
    const [loading, setLoading] = useState(false)
    const [owner, setOwner] = useState()
    const [employees, setEmployees] = useState([])
    const [showFinishDialog, setShowFinishDialog] = useState(false)
    const [showFinishedAlert, setShowFinishedAlert] = useState(false)
    const [showDeletedAlert, setShowDeletedAlert] = useState(false)
    const [finishVotingId, setFinishVotingId] = useState(0)
    const [deleteVotingId, setDeleteVotingId] = useState(0)
    const [showContent, setShowContent] = useState(false)

    const handleClick = (id) => {
        setExpanded({
            ...expanded,
            [id]: !expanded[id]
        });
    }

    useEffect(() => {
        setLoading(true)
        VotingDataService.getVotingsByBarId(barId).then(res => {
            setLoading(false)
            setVotings(res)
        }).catch(err => {
            setOpenVal(true)
            console.log('Error', err)
        })
    }, [barId])


    useEffect(() => {
        BarDataService.getBar(barId).then(res => {
            setOwner(res.data.owner);
            let emp = res.data.employees.map(a => a.username)
            setEmployees(emp)
        }).catch(err => {
            history.push('/pageNotFound')
        })
    }, [barId, history])


    useEffect(() => {
        let state = props.history.location.state;
        if (typeof state !== 'undefined') {
            if (state.data) {
                setData(true)
            } else if (state.delete) {
                setDel(true)

            } else if (state.edit) {
                setEdit(true)
            }
        }
        const interval = setInterval(() => setTime(Date.now()), 2000);
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
        setDel(false)
        setEdit(false)
        setShowFinishedAlert(false)
        setShowDeletedAlert(false)
    };

    const handleDelete = (evt) => {
        setLoading(true)
        VotingDataService.deleteVoting(barId, deleteVotingId)
            .then(res => {
                if (res.status === 200) {
                    handleCloseDialog()
                    setLoading(false)
                    setShowDeletedAlert(true)
                    setLoading(true)
                    VotingDataService.getVotingsByBarId(barId).then(res2 => {
                        setLoading(false)
                        setVotings(res2)
                    }).catch(err => {
                        setOpenVal(true)
                        history.push("/pageNotFound")
                    })
                } else {
                    history.push('/pageNotFound')
                }
            }).catch(exc => {
            history.push('/pageNotFound')
        })
    }

    const handleFinishVoting = (event, reason) => {
        setLoading(true)
        VotingDataService.finishVoting(barId, finishVotingId)
            .then(res => {
                if (res.status === 200) {
                    handleCloseDialog()
                    setLoading(false)
                    setShowFinishedAlert(true)
                    setLoading(true)
                    VotingDataService.getVotingsByBarId(barId).then(res2 => {
                        setLoading(false)
                        setVotings(res2)
                    }).catch(err => {
                        setOpenVal(true)
                        history.push("/pageNotFound")
                    })
                }
            }).catch(err => {
            history.push("/pageNotFound")
        })
    }

    const handleFinishClick = (id) => {
        setShowFinishDialog(true)
        setFinishVotingId(id)
    };

    const handleDeleteClick = (id) => {
        setShowContent(true)
        setDeleteVotingId(id)
    };

    const handleCloseDialog = () => {
        setShowFinishDialog(false);
        setFinishVotingId(0)
        setDeleteVotingId(0)
        setShowContent(false);
    };

    const formatDate = (date) => {
        const closeSplit = date.split(' ')
        const date2 = closeSplit[0].split('-')
        const ti2 = closeSplit[1].split(':')
        return ' ' + date2[0] + '-' + date2[1] + '-' + date2[2] + ' ' + ti2[0] + ':' + ti2[1]
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
        if (time > list[1] && list[1] !== null) {
            return item;
        }
    }

    const getCurrentDates = (item) => {
        const list = convertDate(item)
        if ((time > list[0] && time < list[1]) || (list[1] === null && time > list[0])) {
            return item;
        }
    }


    const getNextDates = (item) => {
        const list = convertDate(item)
        if (time < list[0]) {
            return item;
        }
    }

    function buttonRoles(x, next, finished) {
        if ((owner === username || employees.includes(username)) && next === true && finished === false) {
            return <Button href={'/#/bares/' + barId + '/votings/voting/' + x.id + '/edit'}
                        variant="contained" size='small' color="primary" style={{...stylesComponent.buttonAcceder}}>
                    Editar
                </Button>
        } else if (!(owner === username || employees.includes(username)) && !x.votersUsernames.includes(username) && next === false && finished === false) {
            return <Button href={'/#/bares/' + barId + '/votings/voting/' + x.id}
                        variant="contained" size='small' color="primary" style={{...stylesComponent.buttonAcceder}}
                        data-testid="but">
                    Acceder
                </Button>
        } else if ((owner === username || employees.includes(username)) && next === false && finished === false) {
            return <Button variant="contained" onClick={() => handleFinishClick(x.id)} size='small' color="primary"
                           style={{...stylesComponent.buttonDiscard}} data-testid="finish-but">
                Finalizar
            </Button>
        } else if ((owner === username || employees.includes(username)) && finished === true && next === false) {
            return <Button variant="contained" onClick={() => handleDeleteClick(x.id)} size='small' color="primary"
                           style={{...stylesComponent.buttonDiscard}} data-testid="delete-but">
                Eliminar
            </Button>
        } else if (!(owner === username || employees.includes(username)) && x.votersUsernames.includes(username) && finished === false) {
            return <div className='div-voting'>Ya has votado</div>
        }
    }

    const pastVotings = votings.filter(getPastDates)
    const currentVotings = votings.filter(getCurrentDates)
    const nextVotings = votings.filter(getNextDates)

    const expand = (vote_id) => {
        if (!expanded[vote_id]) {
            return <ExpandLess/>
        }
        return <ExpandMore/>
    }

    const getClosingHour = (closeHour) => {
        if (closeHour === null || closeHour === '') {
            return 'Indefinida'
        }
        return formatDate(closeHour)
    }

    const getNextDatesUI = () => {
        if (nextVotings.length > 0) {
            return nextVotings.map(x =>
                <div key={x.id}>
                    <ListItem button onClick={() => handleClick(x.id)} style={{...stylesComponent.listitem}}>
                        <ListItemText disableTypography style={{...stylesComponent.listItemText1}} primary={x.title}/>
                        {buttonRoles(x, true, false)}
                        {expand(x.id)}
                    </ListItem>
                    <Collapse in={expanded[x.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding style={{...stylesComponent.listdetail}}>
                            <ListItem>
                                <ListItemText disableTypography style={{...stylesComponent.listItemText2}}>
                                    <p className='p'>{x.description}</p>
                                    <p className='p'>Fecha inicio: {formatDate(x.openingHour)} </p>
                                    <p className='p'>Fecha fin: {getClosingHour(x.closingHour)}</p>
                                    {x.options.length > 0 &&
                                    <div><p className='options'>Opciones</p>
                                        <div>{x.options.map(y =>
                                            <div key={y.id} style={{
                                                justifyContent: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                            }}><ArrowRightSharp/><p className='p' key={y.id}>{y.description}</p></div>
                                        )}</div>
                                    </div>}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Collapse>
                </div>)
        }
        return <div className='center'>No existen pr??ximas votaciones</div>
    }


    const adminOrUser = () => {
        if (owner === username || employees.includes(username)) {
            return <div className="header">
                <Button href={'/#/bares/' + barId + '/votings/voting/create'}
                        variant="contained" color="primary"
                        style={{...stylesComponent.buttonCrear}}
                        startIcon={<Add/>}>
                    Crear votaci??n
                </Button>
            </div>
        } else {
            return <Typography className='h5' variant="h6" gutterBottom style={{marginTop: '30px'}}>
                A continuaci??n, podr?? encontrar la lista de votaciones disponibles en las que puede participar, junto
                con las finalizadas
            </Typography>
        }
    }


    const showPastVotings = () => {
        if (pastVotings.length > 0) {
            return pastVotings.map(x => {
                const votes = x.options.map(a => a.votes);
                return <div key={x.id}>
                    <ListItem button onClick={() => handleClick(x.id)} style={{...stylesComponent.listitem}}>
                        <ListItemText disableTypography style={{...stylesComponent.listItemText1}} primary={x.title}/>
                        {buttonRoles(x, false, true)}
                        {!expanded[x.id] ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={expanded[x.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding style={{...stylesComponent.listdetail}}>
                            <ListItem>
                                <ListItemText disableTypography style={{...stylesComponent.listItemText2}}>
                                    <p className='p'>{x.description}</p>
                                    {x.options.length > 0 &&
                                    <div style={{width: '70%', margin: 'auto', textAlign: 'center'}}>
                                        <p className='options'>Resultados</p>
                                        <div style={{
                                            margin: 'auto',
                                            textAlign: 'center',
                                            height: `${x.options.length * 50}px`,
                                            width: '100%'
                                        }}>
                                            <ResponsiveContainer width='99%'>
                                                {getChart(x, votes)}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Collapse>
                </div>
            })
        }
        return <div className='center'>No existen votaciones finalizadas</div>
    }

    const getChart = (x, votes) => {
        return <BarChart
            data={x.options}
            layout="vertical"
            barCategoryGap={1}
            margin={{top: 0, right: 15, left: 5, bottom: 20}}
        >
            <XAxis type="number" hide/>
            <YAxis tickLine={false} axisLine={false} width={90} type="category" dx={3}
                   tick={{fontSize: 12, display: 'inline-block', fontWeight: '600'}} dataKey="description"/>
            <Tooltip/>
            <Bar radius={[0, 5, 5, 0]} dataKey="votes" isAnimationActive={false}>
                <LabelList dataKey="votes" position="right"/>
                {x.options.map((entry, index) => {
                    if (votes !== null && entry.votes === Math.max(...votes)) {
                        return <Cell key={`cell-${index}`} fill='#64e127'/>
                    }
                    return <Cell key={`cell-${index}`} fill="#8884d8"/>
                })}
            </Bar>
        </BarChart>
    }

    const showCurrentVotings = () => {
        if (currentVotings.length > 0) {
            return currentVotings.map(x =>
                <div key={x.id}>
                    <ListItem button onClick={() => handleClick(x.id)} style={{...stylesComponent.listitem}}>
                        <ListItemText disableTypography style={{...stylesComponent.listItemText1}} primary={x.title}/>
                        {buttonRoles(x, false, false)}
                        {!expanded[x.id] ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={expanded[x.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding style={{...stylesComponent.listdetail}}>
                            <ListItem>
                                <ListItemText disableTypography style={{...stylesComponent.listItemText2}}>
                                    <p className='p'>{x.description}</p>
                                    <p className='p'>Fecha fin:
                                        {x.closingHour === null || x.closingHour === '' ? ' Indefinida'
                                            : formatDate(x.closingHour)}
                                    </p>
                                    {x.options.length > 0 && (owner === username || employees.includes(username)) &&
                                    <div style={{width: '70%', margin: 'auto', textAlign: 'center'}}>
                                        <p className='options'>Votos</p>
                                        <div style={{
                                            margin: 'auto',
                                            textAlign: 'center',
                                            height: `${x.options.length * 50}px`,
                                            width: '100%'
                                        }}>
                                            <ResponsiveContainer>
                                                {getChart(x, null)}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>}
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Collapse>
                </div>
            )
        }
        return <div className='center'>No existen votaciones en curso</div>
    }


    return (

        <div style={{marginBottom: '30px'}}>
            {loading ?
                <div className='loading'>
                    <CircularProgress/>
                    <p>Cargando votaciones...</p>
                </div> :
                <div>
                    <Container component="main" maxWidth="md" className={classes.paper}>
                        <CssBaseline/>
                        <Box display="flex" justifyContent="center">
                            <Avatar className={classes.avatar}>
                                <HowToVoteIcon/>
                            </Avatar>
                        </Box>
                        <Typography component="h1" variant="h4">
                            Votaciones
                        </Typography>
                        <div>
                            {adminOrUser()}
                        </div>
                        <div className='div-list'>
                            <Typography className='h5' variant="h6" gutterBottom>
                                Votaciones en curso
                            </Typography>
                            <List component="nav">
                                {showCurrentVotings()}
                            </List>
                            {(owner === username || employees.includes(username)) &&
                            <div className='current'>
                                <Typography className='h5' variant="h6" gutterBottom>
                                    Pr??ximas votaciones
                                </Typography>
                                <List component="nav">
                                    {getNextDatesUI()}
                                </List>
                            </div>}
                            <div className='current'>
                                <Typography className='h5' variant="h6" gutterBottom>
                                    Votaciones finalizadas
                                </Typography>
                                <List component="nav">
                                    {showPastVotings()}
                                </List>
                            </div>
                        </div>
                        < Snackbar open={data} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">
                                ??Votaci??n creada con ??xito!
                            </Alert>
                        </Snackbar>
                        < Snackbar open={del} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">
                                ??Votaci??n eliminada con ??xito!
                            </Alert>
                        </Snackbar>
                        < Snackbar open={edit} autoHideDuration={6000} onClose={handleClose} data-testid='edited-alert'>
                            <Alert onClose={handleClose} severity="success">
                                ??Votaci??n editada con ??xito!
                            </Alert>
                        </Snackbar>
                        <Snackbar open={openVal} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error">
                                Error obteniendo las votaciones
                            </Alert>
                        </Snackbar>
                        <Snackbar open={showFinishedAlert} autoHideDuration={6000} onClose={handleClose}
                                  data-testid='finished-alert'>
                            <Alert onClose={handleClose} severity="success">
                                Se ha finalizado la votaci??n correctamente
                            </Alert>
                        </Snackbar>
                        <Snackbar open={showDeletedAlert} autoHideDuration={6000} onClose={handleClose}
                                  data-testid='deleted-alert'>
                            <Alert onClose={handleClose} severity="success">
                                Se ha eliminado la votaci??n correctamente
                            </Alert>
                        </Snackbar>
                        <Dialog open={showFinishDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description" data-testid='finish-dialog'>
                            <DialogTitle id="alert-dialog-title">{"Finalizar votaci??n"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    ??Est??s seguro de que deseas finalizar la votaci??n? No se podr?? reiniciar luego
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">
                                    Atr??s
                                </Button>
                                <Button onClick={handleFinishVoting} color="primary" data-testid="accept-finish-button"
                                        autoFocus>
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={showContent} onClose={handleCloseDialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                data-testid='delete-dialog'>
                            <DialogTitle id="alert-dialog-title">{"Eliminar votaci??n"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    ??Estas seguro de que deseas borrar la votaci??n?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">
                                    Atr??s
                                </Button>
                                <Button onClick={handleDelete} color="primary" autoFocus
                                        data-testid="accept-delete-button">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                    <Footer/>
                </div>
            }
        </div>
    )
}

const stylesComponent = {

    buttonCrear: {
        backgroundColor: '#006e85',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600'
    },
    buttonAcceder: {
        backgroundColor: '#006e85',
        marginRight: '15px',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600'
    },
    buttonDiscard: {
        backgroundColor: '#d53249',
        color: 'white',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontSize: '15px',
        fontWeight: '600',
        marginRight: '15px'
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
        marginTop: '20px',
        margin: 'auto',
        textAlign: 'center'
    },
}

export default Votings