import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Mesa from '../../components/Mesa'
import { useHistory } from 'react-router'
import { getTables } from '../../services/bartable'
import {getCurrentUser} from '../../services/auth';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5rem',
  },
}))

export default function Mesas(props) {
  const user = getCurrentUser();
  const classes = useStyles()
  const [tables, setTables] = useState([])
  const params = useParams();
  const id = params.barId;
  const history = useHistory();
  var isAdmin = user.roles.includes('ROLE_OWNER') ||user.roles.includes('ROLE_EMPLOYEE');
  const barId = props.match.params.barId;
  useEffect(() => {
    getTables(barId).then((res) => setTables(res))
  }, [barId])
  useEffect(() => {
    if(!isAdmin){
      history.push('/')
    }
  }, [isAdmin,history])

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
