import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Home, LocalBar, AccountCircle, EventSeatTwoTone } from '@material-ui/icons'
import {Link} from 'react-router-dom'
import useUser from '../hooks/useUser'
import Drawer from '@material-ui/core/Drawer'
import { useHistory } from 'react-router'
import MesaDataService from '../services/barTable.service';

const useStyles = makeStyles({
    root: {
        width: '100%',
        textAlign: 'center',
        margin: 'auto',
    },
});

export default function SimpleBottomNavigation(props) {
    const changeAndReload = props;
    const classes2 = useStyles();
    const [value, setValue] = React.useState(0);
    const { isLogged } = useUser()
    const [hasBarTable, setHasBarTable] = useState(false);
    const [barTable, setBarTable] = useState({});
    const history = useHistory()
    const { auth } = useUser()
    useEffect( () => {
        if(auth != null){
            if(auth !== undefined ){
                MesaDataService.getBarTableClient(auth.username).then((res) => {
                    if (res.status === 200){
                        setBarTable(res.data)
                        setHasBarTable(true);
                    }else{
                        setHasBarTable(false);
                    }
                }).catch(error => {
                    setHasBarTable(false);
                    console.log("Error: " + error)
                    history.push('/pageNotFound')
                })
            }
        }
    }, [auth,history,changeAndReload])

    return (
        <Drawer
            variant="persistent"
            anchor="bottom"
            open={isLogged}
        >
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes2.root}
    >
            <BottomNavigationAction xs={3} label="Inicio" icon={<Home />} component={Link} to='/' />
            <BottomNavigationAction xs={3} label="Bares" icon={<LocalBar />} component={Link} to='/bares' />
            {hasBarTable ? 
            <BottomNavigationAction xs={3} label="Tu mesa" icon={<EventSeatTwoTone />} onClick={()=> history.push(`/mesas/detallesMesa/${barTable.id}`)} />
            : 
            <BottomNavigationAction xs={3} label="Perfil" icon={<AccountCircle />} component={Link} to='/profile' />
            }
        </BottomNavigation>
        </Drawer>
    );
}