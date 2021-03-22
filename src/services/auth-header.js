export default function authHeader() {
  const user = JSON.parse(window.sessionStorage.getItem('user'))

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken }
  } else {
    return {}
  }
}
