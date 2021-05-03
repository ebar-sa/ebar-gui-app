  
import axios from 'axios'

export default axios.create({
  baseURL: 'https://ebar-srv-sprint3-kjuk5gkiva-ew.a.run.app/api/',
  headers: {
    'Content-type': 'application/json',
  },
})