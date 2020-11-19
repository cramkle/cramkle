import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ApolloError } from 'apollo-client'
import classnames from 'classnames'
import { ContentState } from 'draft-js'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { useBlock } from '../../hooks/useBlock'
import { useFadeEffect } from '../../hooks/useFadeEffect'
import { TIMEOUT_LONG, pushErrorToast } from '../../toasts/pushToast'
import RetryButton from '../RetryButton'
import DoneIcon from '../icons/DoneIcon'
import CircularProgress from '../views/CircularProgress'
import { Caption } from '../views/Typography'

interface PersistedEditorProps<T extends readonly unknown[]> {
  saveDebounceMs: number
  title: ReactNode
  loading: boolean
  error: ApolloError | undefined
  errorMessage: string
  blockMessage: string
  onSave: (contentState: ContentState, ...args: [...T]) => void
  children: (value: {
    onChange: (contentState: ContentState, ...args: [...T]) => void
  }) => ReactNode
}

const PersistedEditor = <T extends readonly unknown[]>({
  title,
  children,
  onSave,
  loading,
  error,
  errorMessage,
  blockMessage,
  saveDebounceMs = 2000,
}: PersistedEditorProps<T>) => {
  const [debouncing, setDebouncing] = useState(false)
  const debounceIdRef = useRef<NodeJS.Timeout | null>(null)

  const lastChangedContentStateRef = useRef<[ContentState, ...T] | null>(null)

  const handleChange = useCallback(
    (content: ContentState, ...args: [...T]) => {
      setDebouncing(true)
      lastChangedContentStateRef.current = [content, ...args]

      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current)
      }

      debounceIdRef.current = setTimeout(() => {
        setDebouncing(false)
        onSave(content, ...args)
      }, saveDebounceMs)
    },
    [onSave, saveDebounceMs]
  )

  const retrySave = useCallback(() => {
    if (!lastChangedContentStateRef.current) {
      return
    }

    const [content, ...args] = lastChangedContentStateRef.current

    onSave(content, ...args)
  }, [onSave])

  const [saved, setSaved] = useState(false)
  const prevLoadingRef = useRef(loading)

  const { i18n } = useLingui()

  useBlock(loading || !!error || debouncing, blockMessage)

  useEffect(() => {
    if (prevLoadingRef.current === loading || loading) {
      if (loading) {
        setSaved(false)
      }
      return
    }

    if (error) {
      pushErrorToast(
        {
          message: errorMessage,
          action: {
            label: i18n._(t`Retry`),
            onPress: retrySave,
          },
        },
        TIMEOUT_LONG
      )
      return
    }

    setSaved(true)
  }, [loading, error, i18n, retrySave, errorMessage])

  useEffect(() => {
    prevLoadingRef.current = loading
  }, [loading])

  useEffect(function hideSavedMessageEffect() {
    if (!saved) {
      return
    }

    const id = setTimeout(() => {
      setSaved(false)
    }, 2000)

    return () => clearTimeout(id)
  })

  const prevSavedRef = useRef(saved)

  useEffect(() => {
    prevSavedRef.current = saved
  }, [saved])

  const [shouldRender, visible, ref] = useFadeEffect(saved)

  return (
    <>
      <div className="text-base h-8 flex items-center max-w-full">
        <div className="flex-shrink-0">{title}</div>{' '}
        <div className="ml-2 h-full flex-auto flex items-center min-w-0">
          {loading && <CircularProgress className="flex-shrink-0" size={16} />}
          {error && (
            <RetryButton onClick={retrySave}>
              <Trans>Try again</Trans>
            </RetryButton>
          )}
          <Caption
            ref={ref}
            className={classnames(
              'overflow-hidden flex items-center transition-opacity duration-200 ease-in-out',
              {
                hidden: !shouldRender || loading,
                'opacity-0': !visible,
                'opacity-100': visible,
              }
            )}
          >
            <DoneIcon className="text-green-1 mr-2 text-base flex-shrink-0" />
            <span className="min-w-0 truncate">
              <Trans>Saved successfully</Trans>
            </span>
          </Caption>
        </div>
      </div>
      {children({ onChange: handleChange })}
    </>
  )
}

export default PersistedEditor
