'use client'

import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Link from 'next/link'
import * as React from 'react'

import { LogoCircle } from '@src/components/LogoCircle'
import LoginForm from '@src/components/forms/LoginForm'
import { Button } from '@src/components/views/Button'
import { Card, CardContent } from '@src/components/views/Card'

export default function LoginPage() {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-col min-h-screen w-full p-4 items-center justify-center bg-primary-dark text-on-primary">
      <LogoCircle className="w-16 mb-8" />

      <Card className="w-full max-w-md">
        <CardContent>
          <LoginForm />

          <div className="flex items-center my-2">
            <div className="w-full border-t border-divider" />
            <span className="mx-2">
              <Trans>or</Trans>
            </span>
            <div className="w-full border-t border-divider" />
          </div>

          <form action="/api/auth/anonymousLogin" method="post">
            <input
              type="hidden"
              name="zoneInfo"
              value={Intl.DateTimeFormat().resolvedOptions().timeZone}
            />
            <input type="hidden" name="locale" value={i18n.locale} />
            <Button className="w-full" type="submit" variation="secondary">
              <Trans>Continue without account</Trans>
            </Button>
          </form>
        </CardContent>
      </Card>

      <span className="mt-4">
        <Trans>
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-on-primary">
            Sign Up
          </Link>
        </Trans>
      </span>
    </div>
  )
}
