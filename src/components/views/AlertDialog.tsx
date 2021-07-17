import type {
  AlertDialogContentProps,
  AlertDialogProps,
} from '@reach/alert-dialog'
import {
  AlertDialogContent as ReachAlertDialogContent,
  AlertDialogDescription as ReachAlertDialogDescription,
  AlertDialogLabel as ReachAlertDialogLabel,
  AlertDialogOverlay as ReachAlertDialogOverlay,
} from '@reach/alert-dialog'
import classnames from 'classnames'
import { forwardRef } from 'react'
import * as React from 'react'

const AlertDialogDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <ReachAlertDialogDescription
      {...props}
      className={classnames(
        props.className,
        'text-txt text-opacity-text-secondary mt-2 mb-4'
      )}
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

const AlertDialogContent = forwardRef<
  HTMLDivElement,
  AlertDialogContentProps & { className?: string }
>(function DialogContent(props, ref) {
  return (
    <ReachAlertDialogContent
      {...props}
      className={classnames(
        props.className,
        'bg-surface text-txt text-opacity-text-primary rounded shadow p-6 w-full max-w-xl md:max-w-3xl'
      )}
      ref={ref}
    />
  )
})

const AlertDialogOverlay: React.FC<AlertDialogProps & { className?: string }> =
  (props) => {
    return (
      <ReachAlertDialogOverlay
        {...props}
        className={classnames(props.className, 'z-50 px-2')}
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
