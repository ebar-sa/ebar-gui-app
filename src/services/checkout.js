import http from '../http-common'
import authHeader from './auth-header'

export function subscribe(id) {
  return http
    .post(`/payments/subscribe/${id}`, {}, { headers: authHeader() })
    .then((response) => {
      return response.data
    })
}

export function cancel(id) {
  return http
    .delete(`/payments/cancel/${id}`, { headers: authHeader() })
    .then((response) => {
      return response.data
    })
}

export function getSubscriptions() {
  return http
    .get('/payments/subscriptions', { headers: authHeader() })
    .then((response) => {
      return response.data
    })
}

export function getCards() {
  return http
    .get('/payments/cards', { headers: authHeader() })
    .then((response) => {
      return response.data
    })
}

export function addCard(data) {
  return http
    .post('/payments/cards/add', data, { headers: authHeader() })
    .then((response) => {
      return response.data
    })
}

export function setDefaultCard(data) {
  return http
    .post('/payments/cards/setdefault', data, { headers: authHeader() })
    .then((response) => {
      return response.data
    })
}

export function removeCard(data) {
  return http
    .delete('/payments/cards/remove', { data, headers: authHeader() })
    .then((response) => {
      return response.data
    })
}

export function payBill(data, tableId) {
      return http.post("/payments/bill/" + tableId, data, { headers: authHeader() })
}

