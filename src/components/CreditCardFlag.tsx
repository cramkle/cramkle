import type { ReactNode, VFC } from 'react'
import { Suspense, lazy } from 'react'

import { NoSSR } from './NoSSR'
import { CreditCardIcon } from './icons/CreditCardIcon'

const AmericanExpressIcon = lazy(() =>
  import('./icons/AmericanExpressIcon').then(({ AmericanExpressIcon }) => ({
    default: AmericanExpressIcon,
  }))
)
const DinersClubIcon = lazy(() =>
  import('./icons/DinersClubIcon').then(({ DinersClubIcon }) => ({
    default: DinersClubIcon,
  }))
)
const DiscoverIcon = lazy(() =>
  import('./icons/DiscoverIcon').then(({ DiscoverIcon }) => ({
    default: DiscoverIcon,
  }))
)
const JCBIcon = lazy(() =>
  import('./icons/JCBIcon').then(({ JCBIcon }) => ({ default: JCBIcon }))
)
const MastercardIcon = lazy(() =>
  import('./icons/MastercardIcon').then(({ MastercardIcon }) => ({
    default: MastercardIcon,
  }))
)
const UnionPayIcon = lazy(() =>
  import('./icons/UnionPayIcon').then(({ UnionPayIcon }) => ({
    default: UnionPayIcon,
  }))
)
const VisaIcon = lazy(() =>
  import('./icons/VisaIcon').then(({ VisaIcon }) => ({ default: VisaIcon }))
)

const BRAND_TO_ICON_MAP: Record<string, ReactNode> = {
  visa: <VisaIcon />,
  mastercard: <MastercardIcon />,
  amex: <AmericanExpressIcon />,
  diners: <DinersClubIcon />,
  discover: <DiscoverIcon />,
  jcb: <JCBIcon />,
  unionpay: <UnionPayIcon />,
}

export const CreditCardFlag: VFC<{ brand?: string }> = ({ brand }) => {
  return (
    <NoSSR fallback={<CreditCardIcon />}>
      <Suspense fallback={<CreditCardIcon />}>
        {BRAND_TO_ICON_MAP[brand ?? ''] ?? <CreditCardIcon />}
      </Suspense>
    </NoSSR>
  )
}
