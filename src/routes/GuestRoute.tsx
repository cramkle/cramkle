import { createRoute } from './AuthRoute'

const GuestRoute = createRoute({
  challenge: (user) => user == null,
  displayName: 'GuestRoute',
})

export default GuestRoute
