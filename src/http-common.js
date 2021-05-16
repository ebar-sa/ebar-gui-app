  
import axios from 'axios'

export default axios.create({
  baseURL: 'https://v4-srv.ebarapp.es/api/',
  headers: {
    'Content-type': 'application/json',
  },
})