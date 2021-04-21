import { useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import {
  INVOICE_FRAGMENT,
  InvoiceDetails,
  InvoicePlaceholder,
} from '../InvoiceDetails'
import { SubscriptionCreditCard } from '../SubscriptionCreditCard'
import { useCurrentUser } from '../UserContext'
import { Card, CardContent } from '../views/Card'
import type {
  LatestInvoice,
  LatestInvoiceVariables,
} from './__generated__/LatestInvoice'

const LATEST_INVOICES_QUERY = gql`
  query LatestInvoice($first: Int!) {
    me {
      id
      invoices(first: $first) {
        totalCount
        edges {
          node {
            ...InvoiceDetails_invoice
          }
        }
      }
    }
  }

  ${INVOICE_FRAGMENT}
`

const INVOICES_TO_PREVIEW = 1

const SubscriptionSettings = () => {
  const me = useCurrentUser()

  const { data, loading } = useQuery<LatestInvoice, LatestInvoiceVariables>(
    LATEST_INVOICES_QUERY,
    {
      variables: { first: INVOICES_TO_PREVIEW },
    }
  )

  const latestInvoice = data?.me?.invoices.edges?.[0]?.node

  return (
    <>
      <Card className="mt-4">
        <CardContent>
          <h2 className="mb-4 font-medium text-2xl">
            <Trans>Plan details</Trans>
          </h2>

          <div className="flex items-center">
            <span>
              <Trans>{me.subscription?.plan ?? t`Free`} plan</Trans>
            </span>

            <Link to="checkout" className="ml-2 text-primary">
              <Trans>change</Trans>
            </Link>
          </div>

          {me.subscription && (
            <SubscriptionCreditCard
              className="mt-4"
              subscription={me.subscription}
            />
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardContent className="flex flex-col">
          <h2 className="font-medium text-2xl">
            <Trans>Payment history</Trans>
          </h2>
        </CardContent>

        {loading || data == null ? (
          <InvoicePlaceholder className="border-b" />
        ) : (
          <>
            {data.me?.invoices.totalCount === 0 ? (
              <CardContent>
                <span className="text-txt text-opacity-text-secondary">
                  <Trans>You haven't made any payments yet</Trans>
                </span>
              </CardContent>
            ) : (
              <>
                <CardContent>
                  <p>
                    <Trans>Latest invoice</Trans>
                  </p>
                </CardContent>

                <InvoiceDetails className="border-b" invoice={latestInvoice!} />

                <CardContent>
                  <Link
                    to="payment-history"
                    className="text-primary hover:underline focus:underline self-start"
                  >
                    <Trans>See full history</Trans>
                  </Link>
                </CardContent>
              </>
            )}
          </>
        )}
      </Card>
    </>
  )
}

export default SubscriptionSettings
