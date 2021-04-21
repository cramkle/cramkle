import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import gql from 'graphql-tag'

import { CreditCardFlag } from './CreditCardFlag'
import type { InvoiceDetails_invoice } from './__generated__/InvoiceDetails_invoice'

export const InvoicePlaceholder = ({ className }: { className?: string }) => {
  return (
    <div
      className={classnames(
        className,
        'flex border-t border-divider border-opacity-divider p-4'
      )}
    >
      <div className="w-full flex flex-col">
        <span className="w-48 sm:w-64 md:w-96 h-5 inline-block mb-3 bg-divider bg-opacity-divider rounded" />

        <div className="flex items-center">
          <span className="w-10 sm:w-16 md:w-32 h-5 bg-divider bg-opacity-divider rounded max-w-xxs" />
          <div className="ml-2 w-8">
            <CreditCardFlag />
          </div>
          <span className="ml-2 w-16 h-5 bg-divider bg-opacity-divider rounded" />
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="w-16 sm:w-24 md:w-48 h-5 bg-divider bg-opacity-divider rounded inline-block mb-3" />
        <span className="w-16 sm:w-24 md:w-48 h-5 bg-divider bg-opacity-divider rounded" />
      </div>
    </div>
  )
}

export const INVOICE_FRAGMENT = gql`
  fragment InvoiceDetails_invoice on Invoice {
    id
    number
    currency
    subTotal
    total
    hostedUrl
    periodEnd
    cardBrand
    cardLast4Digits
  }
`

export const InvoiceDetails = ({
  className,
  invoice,
}: {
  className?: string
  invoice: InvoiceDetails_invoice
}) => {
  const { i18n } = useLingui()

  return (
    <div
      className={classnames(
        className,
        'flex border-t border-divider border-opacity-divider p-4'
      )}
    >
      <div className="w-full flex flex-col">
        <a
          href={invoice.hostedUrl ?? ''}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-lg text-primary hover:underline focus:underline mb-2 self-start"
        >
          {invoice.number}
        </a>

        <div className="flex items-center">
          <span className="text-txt text-opacity-text-secondary">
            {i18n.date(invoice.periodEnd)}
          </span>
          <div className="ml-4 w-8">
            <CreditCardFlag brand={invoice.cardBrand} />
          </div>
          <span className="ml-2 tracking-tight whitespace-nowrap">• • • •</span>{' '}
          <span className="ml-2">{invoice.cardLast4Digits}</span>
        </div>
      </div>

      <div className="flex flex-col items-end flex-shrink-0 leading-loose">
        <span className="text-txt text-opacity-text-primary">
          <Trans>
            <span className="hidden sm:inline">Total:</span>{' '}
            <span className="font-medium">
              {i18n.number(invoice.total / 100, {
                style: 'currency',
                currency: invoice.currency,
                currencyDisplay: 'code',
              })}
            </span>
          </Trans>
        </span>
        <span className="text-txt text-opacity-text-secondary hidden sm:inline">
          <Trans>
            Sub-total:{' '}
            <span className="font-medium">
              {i18n.number(invoice.subTotal / 100, {
                style: 'currency',
                currency: invoice.currency,
                currencyDisplay: 'code',
              })}
            </span>
          </Trans>
        </span>
      </div>
    </div>
  )
}
