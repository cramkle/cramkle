import { createRoute } from './AuthRoute'

const GuestRoute = createRoute({
  challenge: (user) => user == null,
  redirectPath: '/home',
  displayName: 'GuestRoute',
})

export default GuestRoute
