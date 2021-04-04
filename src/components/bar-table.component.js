import React, { Component } from "react";
import BarTableService from "../services/bar-table.service";

export default class BarTable extends Component{
    constructor(props) {
      super(props)
      this.getBarTable = this.getBarTable.bind(this);  
      this.state = {
         currentBarTable: {
             id: null,
             nombre:"",
             descripcion: "",
             ubicacion: ""
         },
        message: ""
      };
    };

    componentDidMount(){
        this.getBarTable(this.props.match.params.id);
    }

    
    
}