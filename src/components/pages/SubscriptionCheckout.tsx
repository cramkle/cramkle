import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, select, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import { Suspense, lazy, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { object, string } from 'yup'

import { ReactComponent as Logo } from '../../assets/logo.svg'
import { pushErrorToast, pushSimpleToast } from '../../toasts/pushToast'
import { AppName } from '../AppName'
import type { CardFormRef } from '../CreditCardForm'
import { NoSSR } from '../NoSSR'
import { PlaceOrderButton } from '../PlaceOrderButton'
import { SubscriptionCreditCard } from '../SubscriptionCreditCard'
import { useCurrentUser } from '../UserContext'
import { Button } from '../views/Button'
import { Card, CardContent } from '../views/Card'
import { CircularProgress } from '../views/CircularProgress'
import { Container } from '../views/Container'
import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from '../views/Listbox'
import { SelectButton } from '../views/SelectButton'
import type {
  CreateSubscription,
  CreateSubscriptionVariables,
} from './__generated__/CreateSubscription'
import type {
  PremiumPlan,
  PremiumPlanVariables,
  PremiumPlan_subscriptionPlan_prices,
} from './__generated__/PremiumPlan'

const CreditCardForm = lazy(() => import('../CreditCardForm'))

const PREMIUM_PLAN_QUERY = gql`
  query PremiumPlan($currency: String) {
    subscriptionPlan(plan: "premium", currency: $currency) {
      id
      subscriptionName
      plan
      prices {
        id
        period
        amount
        currency
      }
    }
  }
`

const CREATE_SUBSCRIPTION_MUTATION = gql`
  mutation CreateSubscription($priceId: ID!, $cardDetails: CardDetails) {
    createSubscription(
      input: { priceId: $priceId, cardDetails: $cardDetails }
    ) {
      subscription {
        active
        period
        plan
        endsAt
        status
        paymentIntentClientSecret
      }
      error {
        message
        status
      }
    }
  }
`

const SubscriptionCheckout = () => {
  const [currency, setCurrency] = useState('USD')
  const me = useCurrentUser()
  const { i18n } = useLingui()
  const { data, loading: loadingPrices } = useQuery<
    PremiumPlan,
    PremiumPlanVariables
  >(PREMIUM_PLAN_QUERY, {
    variables: { currency },
  })
  const [createSubscription] = useMutation<
    CreateSubscription,
    CreateSubscriptionVariables
  >(CREATE_SUBSCRIPTION_MUTATION)

  const [selectedPlan, setSelectedPlan] = useState<{
    plan: string
    price: PremiumPlan_subscriptionPlan_prices | undefined
  } | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<string | undefined>(
    undefined
  )

  const [isEditingCreditCard, setEditingCreditCard] = useState(
    me.subscription?.paymentMethodId == null
  )

  const cardFormRef = useRef<CardFormRef>(null)

  const navigate = useNavigate()

  const handleSubmit = async (values?: { fullName: string }) => {
    let cardDetails = null

    if (cardFormRef.current != null) {
      const payload = await cardFormRef.current.createPaymentMethod(values!)

      if (!payload || payload.error) {
        console.error(payload?.error)
        pushErrorToast({ message: payload?.error?.message ?? t`Unknown error` })
        return
      }

      const paymentMethod = payload.paymentMethod!

      cardDetails = {
        paymentMethodId: paymentMethod.id,
        cardBrand: paymentMethod.card!.brand,
        cardLast4: paymentMethod.card!.last4,
        cardExpirationMonth: paymentMethod.card!.exp_month.toString(),
        cardExpirationYear: paymentMethod.card!.exp_year.toString(),
      }
    }

    try {
      const { data: subscriptionData, errors } = await createSubscription({
        variables: {
          priceId: selectedPlan!.price!.id,
          cardDetails,
        },
      })

      if (
        !subscriptionData?.createSubscription ||
        (errors && errors.length > 0)
      ) {
        throw errors?.[0] ?? new Error('Unknown error')
      }

      if (subscriptionData.createSubscription.error) {
        pushErrorToast({
          message: subscriptionData.createSubscription.error.message,
        })
        return
      }

      const subscription = subscriptionData.createSubscription.subscription

      if (subscription == null) {
        throw new Error('Unknown error')
      }

      if (subscription.status === 'active') {
        pushSimpleToast(t`Subscription started successfully`)
        navigate('/settings/subscription')
      } else if (
        subscription.status === 'payment_required' &&
        subscription.paymentIntentClientSecret != null
      ) {
        const result = await cardFormRef.current?.confirmCardPayment(
          subscription.paymentIntentClientSecret
        )

        if (result == null) {
          return
        }

        if (result.error) {
          if (result.error.type === 'card_error' && result.error.message) {
            pushErrorToast({ message: result.error.message })
          } else {
            pushErrorToast({
              message: t`There is an issue with your payment method, please try again or select another credit card`,
            })
          }
          return
        }

        if (result.paymentIntent?.status === 'succeeded') {
          pushSimpleToast(t`Subscription started successfully`)
          navigate('/settings/subscription')
        }
      }
    } catch (e) {
      console.error(e)
      pushErrorToast({
        message: t`An unknown error has occurred`,
      })
    }
  }

  return (
    <>
      <Helmet title={t`Checkout`} />

      <div className="flex min-h-screen bg-background bg-opacity-background">
        <Container className="pt-4 sm:pt-6 md:pt-8">
          <div className="flex items-center">
            <div className="flex items-center">
              <Logo className="h-10 sm:h-12 md:h-14" />
              <AppName className="ml-2 sm:ml-3 md:ml-4 text-lg sm:text-xl md:text-2xl text-txt text-opacity-text-primary" />
            </div>

            <ListboxInput
              value={currency}
              onChange={setCurrency}
              className="ml-auto"
            >
              <ListboxButton className="bg-surface" />
              <ListboxPopover>
                <ListboxList>
                  <ListboxOption value="USD">
                    <Trans>USD</Trans>
                  </ListboxOption>
                  <ListboxOption value="BRL">
                    <Trans>BRL</Trans>
                  </ListboxOption>
                </ListboxList>
              </ListboxPopover>
            </ListboxInput>
          </div>
          <Link
            className="inline-block text-primary mt-6"
            to="/settings/subscription"
          >
            <Trans>Back to settings</Trans>
          </Link>

          <h2 className="text-txt-secondary font-medium mt-12 mb-8 text-2xl">
            <Trans>Change your subscription</Trans>
          </h2>

          {loadingPrices ? (
            <CircularProgress />
          ) : selectedPlan != null ? (
            <>
              <div className="pb-8">
                <p className="text-txt text-opacity-text-primary font-medium text-lg mb-4">
                  <Trans>Selected plan</Trans>
                </p>

                <span className="text-txt text-opacity-text-primary inline-block mb-3 capitalize">
                  <Trans>{selectedPlan.plan} plan</Trans>
                </span>

                <div className="flex">
                  <p className="text-txt text-opacity-text-primary">
                    {selectedPlan.price && selectedPlan.price.amount > 0 ? (
                      <>
                        <span className="text-txt-secondary font-semibold">
                          {i18n.number(selectedPlan.price.amount / 100, {
                            style: 'currency',
                            currency: selectedPlan.price.currency,
                            currencyDisplay: 'code',
                          })}
                        </span>{' '}
                        <span>
                          {i18n._(
                            select(selectedPlan.price.period, {
                              month: '(monthly payment)',
                              year: '(yearly payment)',
                              other: '',
                            })
                          )}
                        </span>
                      </>
                    ) : (
                      <span>
                        <Trans>Your purchase is free</Trans>
                      </span>
                    )}
                  </p>

                  <button
                    className="text-primary bg-transparent border-none ml-2"
                    onClick={() => setSelectedPlan(null)}
                  >
                    <Trans>change</Trans>
                  </button>
                </div>
              </div>

              <Formik
                initialValues={{ fullName: '' }}
                validationSchema={
                  isEditingCreditCard
                    ? object().shape({
                        fullName: string().required(
                          i18n._(t`Name is required`)
                        ),
                      })
                    : undefined
                }
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    {isEditingCreditCard ? (
                      <Card>
                        <CardContent>
                          <p
                            className={classnames(
                              'text-txt text-opacity-text-primary font-medium text-lg',
                              {
                                'mb-2': !!me.subscription?.paymentMethodId,
                                'mb-3': !me.subscription?.paymentMethodId,
                              }
                            )}
                          >
                            <Trans>Inform your payment details</Trans>
                          </p>

                          {me.subscription?.paymentMethodId != null && (
                            <button
                              className="mb-4 text-primary hover:underline"
                              onClick={() => setEditingCreditCard(false)}
                            >
                              <Trans>Go back</Trans>
                            </button>
                          )}

                          <form id="credit-card-form" onSubmit={handleSubmit}>
                            <NoSSR>
                              <Suspense
                                fallback={
                                  <div className="w-full py-8">
                                    <CircularProgress />
                                  </div>
                                }
                              >
                                <CreditCardForm
                                  id="credit-card-form"
                                  ref={cardFormRef}
                                />
                              </Suspense>
                            </NoSSR>
                          </form>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent>
                          <p className="text-txt text-opacity-text-primary font-medium text-lg mb-3">
                            <Trans>Selected payment option</Trans>
                          </p>

                          <form id="credit-card-form" onSubmit={handleSubmit} />

                          <SubscriptionCreditCard
                            className="mt-4"
                            subscription={me.subscription!}
                          />

                          <button
                            className="mt-3 text-primary hover:underline"
                            onClick={() => setEditingCreditCard(true)}
                          >
                            <Trans>Use a different credit card</Trans>
                          </button>
                        </CardContent>
                      </Card>
                    )}

                    <PlaceOrderButton
                      className="my-6 w-full max-w-2xl"
                      type="submit"
                      form="credit-card-form"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Trans>Finishing your purchase</Trans>
                      ) : (
                        <Trans>Confirm purchase</Trans>
                      )}
                    </PlaceOrderButton>
                  </>
                )}
              </Formik>
            </>
          ) : (
            <div className="flex flex-col md:flex-row items-stretch gap-4 mb-6">
              <Card className="flex-1">
                <CardContent className="h-full flex flex-col">
                  <h3 className="text-txt text-opacity-text-primary text-2xl font-medium">
                    <Trans>Basic plan</Trans>
                  </h3>

                  <p className="my-2">
                    <Trans>Recommended for light study routines</Trans>
                  </p>

                  <ul className="text-txt-secondary list leading-6 mb-4">
                    <li>
                      <Trans>Up to 3 decks</Trans>
                    </li>
                    <li>
                      <Trans>Unlimited flashcards</Trans>
                    </li>
                    <li>
                      <Trans>Last 7 days of statistics on study schedule</Trans>
                    </li>
                  </ul>

                  <Button
                    className="w-full mt-auto"
                    variation="primary"
                    onClick={() =>
                      setSelectedPlan({ plan: 'free', price: undefined })
                    }
                    disabled={!me.subscription?.plan}
                  >
                    <Trans>
                      Free plan{' '}
                      {select(me.subscription?.plan ?? 'free', {
                        free: '(current)',
                        other: '',
                      })}
                    </Trans>
                  </Button>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="h-full flex flex-col">
                  <h3 className="text-txt text-opacity-text-primary text-2xl font-medium">
                    <Trans>
                      {data?.subscriptionPlan?.subscriptionName} plan
                    </Trans>
                  </h3>

                  <p className="my-2">
                    <Trans>
                      All you need to take your knowledge retention to the next
                      level
                    </Trans>
                  </p>

                  <ul className="text-txt-secondary list leading-6 mb-4">
                    <li>
                      <Trans>Unlimited decks</Trans>
                    </li>
                    <li>
                      <Trans>Unlimited flashcards</Trans>
                    </li>
                    <li>
                      <Trans>
                        Up to 1 year of statistics on study schedule
                      </Trans>
                    </li>
                  </ul>

                  {loadingPrices || !data ? (
                    <div className="w-full mt-auto h-10 flex items-center justify-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    <SelectButton
                      className="w-full mt-auto"
                      value={selectedPrice}
                      onChange={setSelectedPrice}
                      onSelect={() =>
                        setSelectedPlan({
                          plan: 'premium',
                          price:
                            data?.subscriptionPlan?.prices.find(
                              ({ id }) => id === selectedPrice
                            ) ?? data?.subscriptionPlan?.prices[0],
                        })
                      }
                      disabled={
                        !!me.subscription?.planPriceId &&
                        me.subscription.planPriceId === selectedPrice
                      }
                      key={currency}
                    >
                      {data.subscriptionPlan?.prices.map((price) => (
                        <ListboxOption
                          key={price.id}
                          value={price.id}
                          disabled={me.subscription?.planPriceId === price.id}
                        >
                          {i18n._(
                            select(price.period, {
                              month: 'Monthly plan',
                              year: 'Yearly plan',
                              other: '',
                            })
                          )}{' '}
                          (
                          {me.subscription?.planPriceId === price.id ? (
                            <Trans>current plan</Trans>
                          ) : (
                            i18n.number(price.amount / 100, {
                              style: 'currency',
                              currency: price.currency,
                              currencyDisplay: 'code',
                            })
                          )}
                          )
                        </ListboxOption>
                      ))}
                    </SelectButton>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </div>
    </>
  )
}

export default SubscriptionCheckout
