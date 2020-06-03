import {
  AlertDialogContentProps,
  AlertDialogProps,
  AlertDialogContent as ReachAlertDialogContent,
  AlertDialogDescription as ReachAlertDialogDescription,
  AlertDialogLabel as ReachAlertDialogLabel,
  AlertDialogOverlay as ReachAlertDialogOverlay,
} from '@reach/alert-dialog'
import classnames from 'classnames'
import React, { forwardRef } from 'react'

const AlertDialogDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <ReachAlertDialogDescription
      {...props}
      className={classnames(props.className, 'text-secondary mt-2 mb-4')}
    />
  )
}

const AlertDialogLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <ReachAlertDialogLabel
      {...props}
      className={classnames(
        props.className,
        'text-2xl font-medium leading-normal'
      )}
    />
  )
}

const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function DialogContent(props, ref) {
    return (
      <ReachAlertDialogContent
        {...props}
        className={classnames(props.className, 'rounded shadow p-6')}
        ref={ref}
      />
    )
  }
)

const AlertDialogOverlay: React.FC<AlertDialogProps> = (props) => {
  return (
    <ReachAlertDialogOverlay
      {...props}
      className={classnames(props.className, 'z-50')}
    />
  )
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  id,
  isOpen,
  onDismiss,
  leastDestructiveRef,
  ...props
}) => {
  return (
    <AlertDialogOverlay {...{ isOpen, onDismiss, leastDestructiveRef, id }}>
      <AlertDialogContent {...props} />
    </AlertDialogOverlay>
  )
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogDescription,
  AlertDialogLabel,
}
