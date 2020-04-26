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
      className={classnames(props.className, 'c-text-secondary mt2 mb3')}
    />
  )
}

const AlertDialogLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <ReachAlertDialogLabel
      {...props}
      className={classnames(props.className, 'f3 fw5 lh-copy')}
    />
  )
}

const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function DialogContent(props, ref) {
    return (
      <ReachAlertDialogContent
        {...props}
        className={classnames(props.className, 'br2 shadow-2')}
        ref={ref}
      />
    )
  }
)

const AlertDialogOverlay: React.FC<AlertDialogProps> = (props) => {
  return (
    <ReachAlertDialogOverlay
      {...props}
      className={classnames(props.className, 'z-max')}
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
