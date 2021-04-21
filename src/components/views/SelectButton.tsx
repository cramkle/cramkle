import type { ListboxInputProps } from '@reach/listbox'
import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxPopover,
  useListboxContext,
} from '@reach/listbox'
import type { Position } from '@reach/popover'
import { positionMatchWidth } from '@reach/popover'
import classnames from 'classnames'
import { useCallback, useRef } from 'react'
import type { FC } from 'react'

import { CaretDownIcon } from '../icons/CaretDownIcon'

const Text = () => {
  const { valueLabel } = useListboxContext()

  return <span>{valueLabel}</span>
}

interface Props extends Pick<ListboxInputProps, 'value' | 'onChange'> {
  className?: string
  onSelect?: () => void
  disabled?: boolean
}

export const SelectButton: FC<Props> = ({
  className,
  onSelect,
  disabled,
  children,
  value,
  onChange,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const positionFn: Position = useCallback((_, popoverRect) => {
    const buttonRect = buttonRef.current?.getBoundingClientRect()

    return positionMatchWidth(buttonRect, popoverRect)
  }, [])

  return (
    <ListboxInput
      value={value}
      onChange={onChange}
      className={classnames(
        className,
        'flex rounded bg-primary text-on-primary h-10 overflow-hidden'
      )}
    >
      <button
        className={classnames(
          'h-full py-1 px-6 flex-1 flex items-center justify-center font-medium',
          {
            'cursor-not-allowed bg-always-black bg-opacity-disabled text-on-primary text-opacity-text-secondary': disabled,
            'hover:bg-primary-light focus:bg-primary-light': !disabled,
          }
        )}
        ref={buttonRef}
        disabled={disabled}
        onClick={() => onSelect?.()}
      >
        <Text />
      </button>
      <ListboxButton className="hover:bg-primary-light focus:bg-primary-light h-full border-l flex items-center py-1 px-4">
        <CaretDownIcon />
      </ListboxButton>
      <ListboxPopover
        position={positionFn}
        className="mt-1 py-0 rounded-xl shadow-lg bg-surface"
      >
        <ListboxList className="py-2 h-full rounded-xl outline-none">
          {children}
        </ListboxList>
      </ListboxPopover>
    </ListboxInput>
  )
}
