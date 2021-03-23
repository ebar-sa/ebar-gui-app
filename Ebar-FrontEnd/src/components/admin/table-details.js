import React, { Component } from 'react';
import MesaDataService from '../services/mesa.service';

export default class MesaDetails extends Component {
  constructor(props) {
    super(props)
    this.getTablesDetails(id) = this.getTablesDetails(id).bind(this);
    this.state = {
       mesaActual : {
           id : null,
           nombre: "",
           token: "", 
           free: false,
           bar_id: null,
           bill_id: null,
           client_id: null
       }
    };
  };
  
  componentDidMount() {
      this.getTablesDetails(1);
  }


  getTablesDetails(id) {
      MesaDataService.getMesaDetails(id).then(res => { 
          this.setState({
            currentTable : res.data
          })
          console.log(res.data);
      })
      .catch(e => {
          console.log(e);
      })
  }
  
    render() {
        const {currentTable} = this.state
    return (
        <div>
            <p>Este es el componente de los detalles de la mesa.</p>  
            <p>{currentTable.nombre}</p>
            <p>{currentTable.token}</p>
            <p>{currentTable.free}</p>
        </div>
    );
  }
}