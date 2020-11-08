import { DraftDecorator } from 'draft-js'
import React from 'react'

const findLinkEntities: DraftDecorator['strategy'] = (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    )
  }, callback)
}

export const EditorLink: React.FC<any> = ({
  children,
  contentState,
  entityKey,
}) => {
  const { url } = contentState.getEntity(entityKey).getData()

  return (
    <a
      className="underline text-action-primary"
      href={url}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  )
}

export const linkDecorator: DraftDecorator = {
  component: EditorLink,
  strategy: findLinkEntities,
}
