import React from 'react';
import PageNotFound from '../img/barClosed.png';
import { useHistory } from "react-router"
import {Button} from '@material-ui/core';


function NotFoundPage(){    
        const useStyles = {
            centerImage: {
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '30%',
                display: 'block',
                backgroundColor: '#fafafa'
            }
          }
        const history = useHistory();
        const routeRedirect = () => {
            let path = '/bares';
            history.push(path);
        } 
        return <div>
            <img alt="error" style={useStyles.centerImage} src={PageNotFound}/>
            <div style={{margin:"0 auto"}}>
                <Button style={{marginLeft:"45%"}} variant="contained" color="primary" onClick = {routeRedirect}>
                    Ir al inicio
                </Button>
            </div>
          </div>;
    }
export default NotFoundPage;