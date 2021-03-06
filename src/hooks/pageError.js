import React from 'react';
import PageNotFound from '../img/barClosed.png';
import { useHistory } from "react-router"
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

function NotFoundPage() {
    const useStyles = {
        centerImage: {
            margin: 'auto',
            width: '60%',
            display: 'block',
            backgroundColor: '#fafafa'
        }
    }
    const history = useHistory();
    const routeRedirect = () => {
        let path = '/bares';
        history.push(path);
    }
    return <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br/>
        <div>
            <img alt="error" style={useStyles.centerImage} src={PageNotFound} />

        </div>
        <div style = {{'textAlign':'center', 'margin': 'auto'}}>
            <Button variant="contained"  color="primary" onClick={routeRedirect}>
                Ir al inicio
                </Button>
        </div>
    </Container>
}
export default NotFoundPage;
