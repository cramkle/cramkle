import { createRoute } from './AuthRoute'

const UserRoute = createRoute({
  challenge: (user) => user != null,
  redirectPath: '/login',
  displayName: 'UserRoute',
  appendReturnUrl: true,
})

export default UserRoute
