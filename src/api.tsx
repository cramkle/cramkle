import axios from 'axios'

export default {
  user: {
    register: user => axios.post('/api/user/register', user).then(res => res.data),
    login: credentials => axios.post('/api/auth/login', credentials).then(res => res.data),
    currentUser: () => axios.get('/api/user/').then(res => res.data),
  },
  deck: {
    getAll: () => axios.get('/api/deck/').then(res => res.data),
  },
}

