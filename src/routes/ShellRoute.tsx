import * as React from 'react'
import { Outlet } from 'react-router-dom'

import Shell from '../components/Shell'

const ShellRoute: React.VFC = () => (
  <Shell>
    <Outlet />
  </Shell>
)

export default ShellRoute
