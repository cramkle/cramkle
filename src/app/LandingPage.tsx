'use client'

import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Link from 'next/link'
import * as React from 'react'

import { AppName } from '@src/components/AppName'
import { Footer } from '@src/components/Footer'
import { Logo } from '@src/components/Logo'
import { Button } from '@src/components/views/Button'
import {
  Header,
  HeaderContent,
  HeaderSection,
} from '@src/components/views/Header'

import styles from './LandingPage.module.css'

const RegisterForm = React.lazy(
  () => import('@src/components/forms/RegisterForm')
)

export default function LandingPage() {
  const { i18n } = useLingui()

  return (
    <>
      <Header>
        <HeaderContent>
          <HeaderSection>
            <div className="flex items-center pl-1">
              <Logo
                aria-label={i18n._(t`Two overlapping blue rectangles`)}
                width="32"
              />
              <AppName className="ml-2" />
            </div>
          </HeaderSection>
          <HeaderSection className="hidden sm:inline-flex" align="end">
            <Button
              as={Link}
              variation="secondary"
              href="/login"
              className="flex items-center"
            >
              <Trans>Login</Trans>
            </Button>
            <Button
              as={Link}
              variation="primary"
              href="/register"
              className="flex items-center ml-3"
            >
              <Trans>Sign up</Trans>
            </Button>
          </HeaderSection>
        </HeaderContent>
      </Header>
      <section className="bg-surface space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-44">
        <div className={styles.hero + ' bg-primary text-on-primary'}>
          <section className="max-w-screen-lg xl:max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-8 py-16 px-4 sm:px-6 md:px-8">
              <div className="self-center mx-auto lg:mx-none max-w-lg lg:max-w-none">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter">
                  <Trans>Make sure your knowledge will last</Trans>
                </h1>
                <p className="text-on-primary text-lg sm:text-2xl mt-8 sm:mt-10 font-medium tracking-normal">
                  <Trans>
                    Optimize your knowledge retention with this effective study
                    method.
                  </Trans>
                </p>
              </div>
              <React.Suspense fallback={null}>
                <div className="self-center flex flex-col items-center">
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
              </React.Suspense>
            </div>
          </section>
        </div>
        <section className="max-w-screen-lg xl:max-w-screen-xl mx-auto space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-44">
          <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
            <p className="text-txt-secondary max-w-4xl text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium sm:leading-10 mb-12">
              <Trans id="product-description">
                Cramkle is a flashcard-based study platform, where you can group
                subjects into decks, that automatically schedules study sessions
                using a spaced-repetition algorithm to maximize your knowledge
                retention
              </Trans>
            </p>

            <a
              className="text-primary hover:underline text-base sm:text-lg md:text-xl"
              href="https://wikipedia.org/wiki/Spaced_repetition"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Trans>Learn about spaced repetition</Trans>
            </a>
          </div>
          <div className="text-right px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
            <p className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary-dark text-3xl sm:text-5xl lg:text-6xl leading-tight py-1 font-extrabold tracking-tight mb-8">
              <Trans>
                Simple for those who want it, powerful for those who need it
              </Trans>
            </p>
            <p className="text-txt-secondary ml-auto max-w-4xl text-lg sm:text-2xl font-medium sm:leading-10">
              <Trans>
                From creating simple front and back flashcards, to automating
                their creation with models and user-defined templates, you can
                achieve the flexibility you need without complicating your study
                routine.
              </Trans>
            </p>
          </div>
          <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
            <p className="text-transparent bg-clip-text bg-gradient-to-b from-primary-dark to-txt text-3xl sm:text-5xl lg:text-6xl leading-tight py-1 font-extrabold tracking-tight mb-8">
              <Trans>Start studying now, anonymously</Trans>
            </p>
            <p className="text-txt-secondary max-w-4xl text-lg sm:text-2xl font-medium sm:leading-10">
              <Trans>
                With Cramkle you don't need to create an account to start
                studying, use the anonymous login to get a feel for the app and
                fill in your personal information later when you're comfortable
                to do so.
              </Trans>
            </p>
          </div>
          <div className="text-center px-4 sm:px-6 md:px-8">
            <h1 className="text txt text-opacity-text-primary text-3xl sm:text-5xl lg:text-6xl leading-none font-extrabold tracking-tight mb-12">
              <Trans>Create your account today!</Trans>
            </h1>
            <Button
              as={Link}
              href="/register"
              size="large"
              variation="primary"
              className="inline-flex items-center"
            >
              <Trans id="landing.cta">Get started</Trans>
            </Button>
          </div>
        </section>
        <Footer />
      </section>
    </>
  )
}
