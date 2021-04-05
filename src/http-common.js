import axios from "axios";

export default axios.create({
  //baseURL: "https://ebar-srv-sprint1.herokuapp.com/api/",
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-type": "application/json"
  }
});