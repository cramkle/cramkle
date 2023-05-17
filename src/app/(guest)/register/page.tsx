'use client'

import { Trans } from '@lingui/macro'
import Link from 'next/link'
import * as React from 'react'

import { LogoCircle } from '@src/components/LogoCircle'
import RegisterForm from '@src/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 justify-center items-center bg-primary-dark text-on-primary">
      <LogoCircle className="w-16 mb-8" />

      <RegisterForm />

      <span className="mt-4">
        <Trans>
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-on-primary">
            Log In
          </Link>
        </Trans>
      </span>
    </div>
  )
}
