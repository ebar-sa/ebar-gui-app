import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import Mesa from '../../components/Mesa'
import { getTables } from '../../services/bartable'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5rem',
  },
}))

export default function Mesas(props) {
  const classes = useStyles()

  const [tables, setTables] = useState([])

  const barId = props.match.params.barId;

  useEffect(() => {
    getTables(barId).then((res) => setTables(res))
  }, [])

  return (
    <div className={classes.root}>
      <h1>Mesas</h1>
      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={3} key={table.id}>
            <Mesa {...table} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
