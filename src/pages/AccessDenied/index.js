import React from 'react';
import { useHistory } from "react-router"
import {Button} from '@material-ui/core';


function AccessDenied(){    
        const useStyles = {
            centerImage: {
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '30%',
                display: 'block',
                backgroundColor: '#fafafa'
            },
            centerDiv : {
                marginTop: '10px',
            }, 
            centerText: {
                alignItems: 'center',
            },
            divMessage : {
                boxShadow: '0 0 10px #9c4343',
                width: '50%',
                padding: '3%',
                margin: '0 auto',
                marginTop: '13%',
            }
          }
        const history = useHistory();
        const routeRedirect = () => {
            let path = '/bares';
            history.push(path);
        } 
        return <div>
            <div style={useStyles.divMessage}>
                <h4 align='center'>No tienes acceso a esta parte. Cuidado con las acciones ilegales</h4>
            </div>
            <div style={useStyles.centerDiv} align='center' >
                <Button  variant="contained" color="primary" onClick = {routeRedirect}>
                    Ir al inicio
                </Button>
            </div>
            </div>
    }
export default AccessDenied;
