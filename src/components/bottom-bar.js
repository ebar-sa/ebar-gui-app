import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Home, LocalBar, AccountCircle } from '@material-ui/icons'
import {Link} from 'react-router-dom'
import useUser from '../hooks/useUser'
import Drawer from '@material-ui/core/Drawer'


const useStyles = makeStyles({
    root: {
        width: '100%',
        textAlign: 'center',
        margin: 'auto',
    },
});

export default function SimpleBottomNavigation(props) {
    const classes2 = useStyles();
    const [value, setValue] = React.useState(0);
    const { isLogged } = useUser()

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
            <BottomNavigationAction label="Inicio" icon={<Home />} component={Link} to='/' />
            <BottomNavigationAction label="Bares" icon={<LocalBar />} component={Link} to='/bares' />
            <BottomNavigationAction label="Perfil" icon={<AccountCircle />} component={Link} to='/profile' />
        </BottomNavigation>
        </Drawer>
    );
}