import React, { Component } from "react";
import BarTableService from "../services/bar-table.service";

export default class BarTableList extends Component {
  
  constructor(props) {
    super(props)
    this.getAllTables = this.getAllTables.bind(this);
    console.log('El componente aun no está disponible en el DOM');
    this.state = {
        tables: [],
        currentIndex: -1, 
    };
  }

  componentDidMount() {
      this.getAllTables();
      console.log('El componente está disponible en el DOM');
  }
  
  getAllTables() {
      BarTableService.getAll().then(res => {
          this.setState({
              tables : res.data
          });
          console.log(res.data);
      })
      .catch(e => {
          console.log("El error es ",e);
      });
  }

  refreshList() {
    this.getAllTables();
    this.setState({
      currentBarTable: null,
      currentIndex: -1
    });
  }
  
  
    render() {
        const {tables} = this.state;
    return (
      <div className="list row"> 
        <div className="col-md-6">
            <h3 className="align-content-center">Lista de Bares</h3>
            <table className="table" >
             
                <thead>
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Ubicacion</th>
                    </tr>
                </thead>
                <tbody>
                {tables  && tables.map((table, idx) => (
                    <tr>
                        <td>{table.nombre}</td>
                        <td>{table.descripcion}</td>
                        <td>{table.ubicacion}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div>
              <br />
              <p>Esto es un pequeño ejemplo para asegurar el correcto funcionamiento</p>
        </div>
      </div>
    );
  }
}