import classnames from 'classnames'
import type { VFC } from 'react'

import { CreditCardFlag } from './CreditCardFlag'
import type { UserQuery_me_subscription } from './__generated__/UserQuery'

interface Props {
  className?: string
  subscription: UserQuery_me_subscription
}

export const SubscriptionCreditCard: VFC<Props> = ({
  className,
  subscription,
}) => {
  return (
    <div className={classnames(className, 'flex items-center')}>
      <div className="w-8">
        <CreditCardFlag brand={subscription.cardBrand} />
      </div>
      <span className="ml-2 tracking-tight">• • • •</span>{' '}
      <span className="ml-2">{subscription.cardLast4Digits}</span>
      <span className="ml-2 text-txt-secondary">
        {subscription.cardExpirationMonth}/{subscription.cardExpirationYear}
      </span>
    </div>
  )
}
