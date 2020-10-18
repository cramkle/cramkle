import React, { useState } from 'react'

import { pushSimpleToast } from '../../toasts/pushToast'
import Portal from '../Portal'
import WarningIcon from '../icons/WarningIcon'
import Button from './Button'
import { Toast, ToastAnimation, Toaster } from './Toast'

export const Default = () => {
  return <Toast message="Hello!" />
}

export const WithAction = () => {
  return (
    <Toast
      message="Hello!"
      action={{
        label: 'Click me',
        onPress: () => {
          alert('You clicked me!')
        },
      }}
    />
  )
}

export const WithIcon = () => {
  return (
    <Toast
      message="You have a problem with your account"
      icon={<WarningIcon className="text-yellow-1" />}
    />
  )
}

export const WithAnimation = () => {
  const [toastsAdded, setToastsAdded] = useState(0)
  return (
    <>
      <Button
        onClick={() => {
          pushSimpleToast(`Hello from toast ${toastsAdded + 1}`, 2000)
          setToastsAdded((prevToastsAdded) => prevToastsAdded + 1)
        }}
      >
        Add toast
      </Button>
      <Portal target={document.body}>
        <Toaster className="fixed bottom-0 mb-4 w-full flex justify-center">
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
    </>
  )
}

export default {
  title: 'Toast',
  component: Toast,
}
