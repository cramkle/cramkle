import { useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import classnames from 'classnames'
import gql from 'graphql-tag'
import type { MouseEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import {
  INVOICE_FRAGMENT,
  InvoiceDetails,
  InvoicePlaceholder,
} from '../InvoiceDetails'
import { Button } from '../views/Button'
import { Card, CardContent } from '../views/Card'
import { Container } from '../views/Container'
import type { Invoices, InvoicesVariables } from './__generated__/Invoices'

const INVOICES_QUERY = gql`
  query Invoices($first: Int!, $after: String) {
    me {
      id
      invoices(first: $first, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
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

const INVOICES_TO_PREVIEW = 5

const PaymentHistory = () => {
  const { data, loading, fetchMore } = useQuery<Invoices, InvoicesVariables>(
    INVOICES_QUERY,
    {
      variables: { first: INVOICES_TO_PREVIEW },
    }
  )

  const handleLoadMore = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()

    fetchMore({
      variables: {
        first: INVOICES_TO_PREVIEW,
        after: data?.me?.invoices.pageInfo.endCursor,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        return {
          ...prevResult,
          me: {
            ...prevResult.me!,
            invoices: {
              ...prevResult.me!.invoices,
              edges: [
                ...prevResult.me!.invoices.edges!,
                ...fetchMoreResult!.me!.invoices.edges!,
              ],
              pageInfo: fetchMoreResult!.me!.invoices.pageInfo,
            },
          },
        }
      },
    })
  }

  return (
    <>
      <Helmet title={t`Payment history`} />

      <Container className="py-4">
        <h2 className="text-2xl text-txt text-opacity-text-primary font-medium mb-4">
          <Trans>Payment history</Trans>
        </h2>

        <Link to=".." className="text-primary hover:underline focus:underline">
          <Trans>Back to settings</Trans>
        </Link>

        <Card className="mt-8">
          <CardContent className="flex flex-col">
            <h2 className="font-medium text-xl">
              <Trans>Invoices</Trans>
            </h2>
          </CardContent>

          {loading || data == null ? (
            <>
              <InvoicePlaceholder />

              <InvoicePlaceholder />

              <InvoicePlaceholder className="border-b" />
            </>
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
                  {data.me?.invoices.edges?.map((edge, i) => (
                    <InvoiceDetails
                      key={edge!.node!.id}
                      invoice={edge!.node!}
                      className={classnames({
                        'border-b': i === data.me!.invoices.edges!.length - 1,
                      })}
                    />
                  ))}

                  <CardContent>
                    <Button
                      className="self-start"
                      disabled={!data.me?.invoices.pageInfo.hasNextPage}
                      onClick={handleLoadMore}
                    >
                      <Trans>Load more</Trans>
                    </Button>
                  </CardContent>
                </>
              )}
            </>
          )}
        </Card>
      </Container>
    </>
  )
}

export default PaymentHistory
