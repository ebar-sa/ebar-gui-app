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
            },
            centerDiv : {
                marginLeft: '35%'
            }
          }
        const history = useHistory();
        const routeRedirect = () => {
            let path = '/bares';
            history.push(path);
        } 
        return <div>
            <img alt="error" style={useStyles.centerImage} src={PageNotFound}/>
            <div>
                <Button  style={useStyles.centerDiv} variant="contained" color="primary" onClick = {routeRedirect}>
                    Ir al inicio
                </Button>
            </div>
            </div>
    }
export default NotFoundPage;
