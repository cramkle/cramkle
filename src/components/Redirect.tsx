import type { Location } from 'history'
import { useEffect } from 'react'
import * as React from 'react'
import { useHref, useLocation, useNavigate } from 'react-router'

export class RedirectError extends Error {
  public url
  public appendReturnUrl

  constructor(url: string, appendReturnUrl: boolean) {
    super('Cannot redirect on server')

    this.url = url
    this.appendReturnUrl = appendReturnUrl
  }
}

const Redirect: React.VFC<{
  to: string | Partial<Location>
  appendReturnUrl?: boolean
}> = ({ to, appendReturnUrl = false }) => {
  const resolvedTo = useHref(to)
  const location = useLocation()

  if (typeof window === 'undefined') {
    throw new RedirectError(resolvedTo, appendReturnUrl)
  }

  const navigate = useNavigate()

  useEffect(() => {
    const url = new URL(window.location.origin + resolvedTo)

    let search = url.search ? url.search : ''

    if (appendReturnUrl) {
      search =
        (search ? '&' : '?') +
        'returnUrl=' +
        encodeURIComponent(location.pathname)
    }

    navigate(
      url.pathname + search,
      typeof to !== 'string' ? { state: to.state } : undefined
    )
  }, [navigate, to, resolvedTo, location.pathname, appendReturnUrl])

  return <div dangerouslySetInnerHTML={{ __html: '' }} />
}

export default Redirect
