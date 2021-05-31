  
import axios from 'axios'

export default axios.create({
  baseURL: 'https://srv.ebarapp.es/api/',
  headers: {
    'Content-type': 'application/json',
  },
})