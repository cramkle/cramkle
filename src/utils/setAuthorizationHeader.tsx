import axios from 'axios'

export default function setAuthorizationHeader(token) {
  if (token) {
    axios.defaults.headers.common.authorization = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common.authorization
  }
}

