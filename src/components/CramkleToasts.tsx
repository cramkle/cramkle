import * as React from 'react'

import { NoSSR } from './NoSSR'
import Portal from './Portal'
import { ToastAnimation, Toaster } from './views/Toast'

const CramkleToasts: React.VFC = () => {
  return (
    <NoSSR>
      <Portal
        target={typeof document !== 'undefined' ? document.body : undefined}
      >
        <Toaster className="w-full fixed z-10 bottom-0 left-0 ml-4 mb-4">
          {(toast, id, position, expired) => {
            return (
              <ToastAnimation
                key={id}
                id={id}
                position={position}
                expired={expired}
              >
                {toast}
              </ToastAnimation>
            )
          }}
        </Toaster>
      </Portal>
    </NoSSR>
  )
}

export default CramkleToasts
