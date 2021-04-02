import React, { Component } from "react";

export default class Bar extends Component{
    constructor(props) {
      super(props)
      this.getBar = this.getBar.bind(this);  
      this.state = {
         currentBar: {
             id: null,
             name:"",
             description: "",
             contact: "",
             location: "",
             openingTime: "",
             closingTime: "",
             capacity: ""
         },
        message: ""
      };
    }

    componentDidMount(){
        this.getBar(this.props.match.params.id);
    }

    
    
}