import axios from "axios";

export default axios.create({
  baseURL: "https://ebar-srv-sprint1.herokuapp.com/api/",
  headers: {
    "Content-type": "application/json"
  }
});