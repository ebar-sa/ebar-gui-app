import React, { Component } from 'react';
import MesaDataService from '../services/mesa.service';
import { Typography, CardContent, Grid, CardActions,Card,Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import mesaLibre from '../static/images/table/mesaLibre.png'
import mesaOcupada from '../static/images/table/mesaOcupada.png'

export default class BarTableDetails extends Component {
  constructor(props) {
    super(props)
    this.getMesasDetails = this.getMesasDetails.bind(this);
    this.changeStateToFree = this.changeStateToFree.bind(this);
    this.changeStateToOcupated = this.changeStateToOcupated.bind(this);
    this.isLogged = this.isLogged.bind(this);
    this.state = {
       mesaActual : {
           id : null,
           nombre: "",
           token: "", 
           estadoMesa: "",
           seats: null,
           bar_id: null,
           trabajador_id: null
       },
       isLogged:false
    };
  };
  
  componentDidMount() {
    console.log(this.props.match.params.id); 
    this.getMesasDetails(this.props.match.params.id);
    this.isLogged();
  } 
  isLogged(){
    if(localStorage.getItem('user')){
      this.setState({
        isLogged : true
      })
    }else { 
      this.setState({
        isLogged:false
      })
    }
  }

  getMesasDetails(id) {
      MesaDataService.getBarTable(id).then(res => { 
          this.setState({
              mesaActual : res.data
          })
          console.log(res.data);
      })
      .catch(e => {
          console.log(e);
      })
  }

  changeStateToFree() {
    const id = this.props.match.params.id;
    MesaDataService.updateBarTableStateToFree(id).then(res => { 
      this.setState({  
        mesaActual:res.data
      })
      console.log(res.data)
    }).catch(e =>{
      console.log(e);
    })
  }
  changeStateToOcupated() {
    const id = this.props.match.params.id;
    MesaDataService.updateBarTableStateToBusy(id).then(res => { 
      this.setState({  
        mesaActual:res.data
      })
      console.log(res.data)
    }).catch(e =>{
      console.log(e);
    })
  }
  
  
    render() {
        const useStyles = makeStyles({
          card: {
            margin: 16,
            display: "flex",
            flexDirection: "column",
            maxWidth: 100,
            justifyContent: "space-between"
          },
          title: {
            fontSize: 16,
          },
          botton: {
            fontSize: 16,

          },
          cardAction: {
            width: '100%',
          },
          nombreMesa: { 
            textAlign:'center',
            marginLeft: 15
          },
          pos: {
            marginBottom: 12,
          },
          occupied: {
            backgroundColor: '#ddd',
          }, 
          free: {
            backgroundColor: '#fff',
          },
        })
        const {mesaActual,isLogged} = this.state
    return (
      
        <div>
          <Grid container spacing={0} justify="center" >
            <Grid item component={Card} xs>
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom>
                  {mesaActual.name}
                </Typography>
                {mesaActual.free ? 
                <img alt="Mesa Libre" src={mesaLibre} />
                : 
                <img alt="Mesa Ocupada" src={mesaOcupada} />
                }
              </CardContent>
            </Grid>

            <Grid item component={Card} xs>
              <CardContent>
                <Typography variant="h5"className={useStyles.title} gutterBottom> 
                  Código
                </Typography> 
                <Typography variant="h4" component="h2">
                   {mesaActual.token}
                </Typography>
              </CardContent>
              <CardActions>
                {mesaActual.free ? 
                <Button variant="contained" color="primary" onClick = {this.changeStateToOcupated}>
                    Ocupar Manualmente
                </Button>
                :
                <Button variant="contained" color="secondary" onClick = {this.changeStateToFree}>
                    Desocupar Manualmente
                </Button>
                }
              </CardActions>
            </Grid>

            <Grid item component={Card} xs>
              <CardContent>
                <Typography variant="h5" className={useStyles.title} gutterBottom> 
                  Informacion
                </Typography> 
                <Typography variant="h6" className={useStyles.pos}>
                   
                  {mesaActual.free ? 
                      <p>ESTADO: Libre</p> 
                      :
                      <p>ESTADO: Ocupada</p> 
                  } 
                </Typography>
                <Typography variant="h6" className={useStyles.title} gutterBottom> 
                    ASIENTOS: {mesaActual.seats}
                </Typography>  
              </CardContent>
            </Grid>
          </Grid>
        </div>
    );
  }
}
