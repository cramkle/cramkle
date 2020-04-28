import {
  DialogContentProps,
  DialogProps,
  DialogContent as ReachDialogContent,
  DialogOverlay as ReachDialogOverlay,
} from '@reach/dialog'
import classnames from 'classnames'
import React, { forwardRef } from 'react'

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle(props, ref) {
    return (
      <h2
        {...props}
        className={classnames(props.className, 'text-2xl mt-0 mb-4 normal')}
        ref={ref}
      />
    )
  }
)

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    return (
      <ReachDialogContent
        {...props}
        className={classnames(props.className, 'rounded shadow-2')}
        ref={ref}
      />
    )
  }
)

const DialogOverlay: React.FC<DialogProps> = (props) => {
  return (
    <ReachDialogOverlay
      {...props}
      className={classnames(props.className, 'z-max')}
    />
  )
}

const noop = () => {}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { isOpen, onDismiss = noop, initialFocusRef, allowPinchZoom, ...props },
  forwardedRef
) {
  return (
    <DialogOverlay
      initialFocusRef={initialFocusRef}
      allowPinchZoom={allowPinchZoom}
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <DialogContent ref={forwardedRef} {...props} />
    </DialogOverlay>
  )
})

export { Dialog, DialogTitle, DialogContent, DialogOverlay }
