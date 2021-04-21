import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import type {
  PaymentIntent,
  PaymentMethod,
  StripeElementLocale,
  StripeError,
} from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import font300normal from 'fontsource-libre-franklin/files/libre-franklin-latin-300-normal.woff2'
import { forwardRef, useImperativeHandle, useMemo } from 'react'

import { useTheme } from './Theme'
import { TextInputField } from './forms/Fields'
import { Label } from './views/Input'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.CASTERLY_PUBLIC_STRIPE_KEY ?? '')

const useOptions = () => {
  const { theme } = useTheme()

  const options = useMemo(
    () => ({
      style: {
        base: {
          'fontSize': '1rem',
          'color': '#000',
          'letterSpacing': '0.025em',
          'fontFamily': 'Libre Franklin, Helvetica, sans-serif',
          '::placeholder': {
            color: '#90939b',
          },
        },
        invalid: {
          color: theme === 'light' ? '#b00020' : '#df2043',
        },
      },
      classes: {
        base:
          'h-10 mt-2 bg-input rounded border border-divider border-opacity-divider outline-none py-3 px-4 focus:border-primary min-w-0',
      },
    }),
    [theme]
  )

  return options
}

export interface CardFormRef {
  createPaymentMethod: (values: {
    fullName: string
  }) => Promise<{ paymentMethod?: PaymentMethod; error?: StripeError } | null>
  confirmCardPayment: (
    clientSecret: string
  ) => Promise<null | { paymentIntent?: PaymentIntent; error?: StripeError }>
}

interface Props {
  id?: string
  onCreatePaymentMethod?: (paymentMethod: PaymentMethod) => void
}

const CardForm = forwardRef<CardFormRef, Props>(function CardForm(_, ref) {
  const options = useOptions()
  const stripe = useStripe()
  const elements = useElements()
  const { i18n } = useLingui()

  useImperativeHandle(ref, () => ({
    createPaymentMethod: async ({ fullName }) => {
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return null
      }

      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement)!,
        billing_details: {
          name: fullName,
        },
      })

      return payload
    },
    confirmCardPayment: async (clientSecret: string) => {
      if (!stripe || !elements) {
        return null
      }

      return stripe.confirmCardPayment(clientSecret)
    },
  }))

  return (
    <>
      <TextInputField
        className="max-w-lg mb-3"
        label={i18n._(t`Full name`)}
        name="fullName"
        placeholder={i18n._(t`First and last name`)}
      />

      <Label text={i18n._(t`Card number`)}>
        <div className="block">
          <CardNumberElement
            options={{
              ...options,
              classes: {
                ...options.classes,
                base: `${options.classes.base} max-w-lg`,
              },
              showIcon: true,
            }}
          />
        </div>
      </Label>
      <Label className="mt-4" text={i18n._(t`Expiration date`)}>
        <CardExpiryElement
          options={{
            ...options,
            classes: {
              ...options.classes,
              base: `${options.classes.base} max-w-xxs`,
            },
          }}
        />
      </Label>
      <Label className="mt-4" text={i18n._(t`CVC`)}>
        <CardCvcElement
          options={{
            ...options,
            classes: {
              ...options.classes,
              base: `${options.classes.base} max-w-xxs`,
            },
          }}
        />
      </Label>
    </>
  )
})

const CreditCardForm = forwardRef<CardFormRef, Props>(function CreditCardForm(
  props,
  ref
) {
  const { i18n } = useLingui()

  return (
    <Elements
      stripe={stripePromise}
      options={{
        fonts: [
          {
            family: 'Libre Franklin',
            src: `url(${window.location.origin}${font300normal})`,
            display: 'swap',
            style: 'normal',
            weight: '400',
          },
        ],
        locale: i18n.locale as StripeElementLocale,
      }}
    >
      <CardForm {...props} ref={ref} />
    </Elements>
  )
})

export default CreditCardForm
