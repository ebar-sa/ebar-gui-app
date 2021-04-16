import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Mesa from '../../components/Mesa'
import { getTables } from '../../services/bartable'
import AuthService from '../../services/auth.service';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5rem',
  },
}))

export default function Mesas(props) {
  const user = AuthService.getCurrentUser();
  const classes = useStyles()
  const [tables, setTables] = useState([])
  const params = useParams();
  const id = params.barId;
  var isAdmin = false;
  const barId = props.match.params.barId;
  useEffect(() => {
    getTables(barId).then((res) => setTables(res))
  }, [barId])
  user.roles.forEach((rol) => {
    if(rol === 'ROLE_OWNER' || rol ==='ROLE_EMPLOYEE'){
      isAdmin = true;
    }else{ 
      isAdmin = false;
    }
  })

  return (
    <div className={classes.root}>
      <h1>Mesas</h1>
      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={6}  key={table.id}>
            <Mesa {...table} isAdmin={isAdmin} idBar={id} />
          </Grid>
        ))}
        {isAdmin ? 
          <Grid item container xs={12}>
            <ButtonGroup fullWidth={true} color="primary" aria-label="outlined primary button group" className={classes.buttons}>
                <Button href={`/#/mesas/${id}/create`}>Crear Mesa</Button>
            </ButtonGroup>
          </Grid>
          :
          <p></p>
          }
      </Grid>
    </div>
    
  )
}
