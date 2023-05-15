import type { Location } from 'history'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import * as React from 'react'
import { useHref } from 'react-router'

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
  const pathname = usePathname() ?? '/'

  if (typeof window === 'undefined') {
    throw new RedirectError(resolvedTo, appendReturnUrl)
  }

  const router = useRouter()

  useEffect(() => {
    const url = new URL(window.location.origin + resolvedTo)

    let search = url.search ? url.search : ''

    if (appendReturnUrl) {
      search =
        (search ? '&' : '?') + 'returnUrl=' + encodeURIComponent(pathname)
    }

    router.push(url.pathname + search)
  }, [router, to, resolvedTo, pathname, appendReturnUrl])

  return <div dangerouslySetInnerHTML={{ __html: '' }} />
}

export default Redirect
