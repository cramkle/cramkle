import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ApolloError } from 'apollo-client'
import classnames from 'classnames'
import { ContentState } from 'draft-js'
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useBlock } from '../../hooks/useBlock'
import { notificationState } from '../../notification'
import RetryButton from '../RetryButton'
import DoneIcon from '../icons/DoneIcon'
import CircularProgress from '../views/CircularProgress'
import { Body1, Caption } from '../views/Typography'
import styles from './PersistedEditor.css'

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
      notificationState.addNotification({
        message: errorMessage,
        actionText: i18n._(t`Retry`),
        onAction: retrySave,
      })
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

  return (
    <>
      <Body1 className="h-8 flex items-center">
        {title}{' '}
        <div className="ml-2 flex items-center">
          {loading && <CircularProgress size={16} />}
          {error && (
            <RetryButton onClick={retrySave}>
              <Trans>Try again</Trans>
            </RetryButton>
          )}
          <Caption
            className={classnames(
              'inline-flex items-center invisible opacity-0',
              {
                [styles.fadeIn]: saved,
                [styles.fadeOut]: prevSavedRef.current && !saved,
              }
            )}
          >
            <DoneIcon className="text-green-1 mr-2 text-base" />
            <Trans>Changes saved successfully</Trans>
          </Caption>
        </div>
      </Body1>
      {children({ onChange: handleChange })}
    </>
  )
}

export default PersistedEditor
