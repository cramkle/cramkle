import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { useRef, useState } from 'react'

import useLatestRefEffect from '../hooks/useLatestRefEffect'
import { CreateField, CreateFieldVariables } from './__generated__/CreateField'
import { DeleteField, DeleteFieldVariables } from './__generated__/DeleteField'
import { RenameField, RenameFieldVariables } from './__generated__/RenameField'
import AddFieldIcon from './icons/AddFieldIcon'
import ClearIcon from './icons/ClearIcon'
import DoneIcon from './icons/DoneIcon'
import EditIcon from './icons/EditIcon'
import TrashBinIcon from './icons/TrashBinIcon'
import WarningIcon from './icons/WarningIcon'
import { MODEL_QUERY } from './pages/ModelQuery'
import {
  ModelQuery,
  ModelQueryVariables,
  ModelQuery_model_fields,
} from './pages/__generated__/ModelQuery'
import Button from './views/Button'
import { Dialog, DialogTitle } from './views/Dialog'
import IconButton from './views/IconButton'
import { Input } from './views/Input'
import { Body1, Body2, Caption } from './views/Typography'

const CREATE_FIELD_MUTATION = gql`
  mutation CreateField($fieldName: String!, $modelId: ID!) {
    addFieldToModel(input: { modelId: $modelId, name: $fieldName }) {
      field {
        id
        name
      }
    }
  }
`

const RENAME_FIELD_MUTATION = gql`
  mutation RenameField($fieldName: String!, $fieldId: ID!) {
    updateField(input: { id: $fieldId, name: $fieldName }) {
      field {
        id
        name
      }
    }
  }
`

const DELETE_FIELD_MUTATION = gql`
  mutation DeleteField($fieldId: ID!) {
    removeFieldFromModel(input: { fieldId: $fieldId }) {
      field {
        id
        name
      }
    }
  }
`

const EditFieldsDialog: React.FC<{
  isOpen?: boolean
  onDismiss?: () => void
  fields: ModelQuery_model_fields[]
  modelId: string
}> = ({ isOpen, onDismiss, fields, modelId }) => {
  const { i18n } = useLingui()
  const inputRef = useRef<HTMLInputElement>(null)
  const [createField, { loading: createLoading }] = useMutation<
    CreateField,
    CreateFieldVariables
  >(CREATE_FIELD_MUTATION)
  const [renameField, { loading: updateLoading }] = useMutation<
    RenameField,
    RenameFieldVariables
  >(RENAME_FIELD_MUTATION)
  const [deleteField, { loading: deleteLoading }] = useMutation<
    DeleteField,
    DeleteFieldVariables
  >(DELETE_FIELD_MUTATION)

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [fieldName, setFieldName] = useState('')
  const [isDelete, setIsDelete] = useState(false)

  useLatestRefEffect(editingFieldId, () => {
    inputRef.current?.focus()
  })

  const editField = (field?: ModelQuery_model_fields, isDelete = false) => {
    setEditingFieldId(field?.id ?? '')
    setFieldName(field?.name ?? '')
    setIsDelete(isDelete)
  }

  const clearEditField = () => {
    setEditingFieldId(null)
    setFieldName('')
    setIsDelete(false)
  }

  const handleDeleteField = (field: ModelQuery_model_fields) => {
    editField(field, true)
  }

  const confirmDeleteField = async () => {
    await deleteField({
      variables: {
        fieldId: editingFieldId,
      },
      update: (proxy, mutationResult) => {
        const data = proxy.readQuery<ModelQuery, ModelQueryVariables>({
          query: MODEL_QUERY,
          variables: { id: modelId },
        })

        const fieldIndex = data.model.fields.findIndex(
          (field) =>
            field.id === mutationResult.data.removeFieldFromModel.field.id
        )

        data.model.fields.splice(fieldIndex, 1)

        proxy.writeQuery({
          query: MODEL_QUERY,
          variables: { id: modelId },
          data,
        })
      },
    })

    clearEditField()
  }

  const confirmCreateField = async () => {
    await createField({
      variables: { modelId, fieldName },
      update: (proxy, mutationResult) => {
        const data = proxy.readQuery<ModelQuery, ModelQueryVariables>({
          query: MODEL_QUERY,
          variables: { id: modelId },
        })

        data.model.fields.push(mutationResult.data.addFieldToModel.field)

        proxy.writeQuery({
          query: MODEL_QUERY,
          variables: { id: modelId },
          data,
        })
      },
    })

    clearEditField()
  }

  const confirmUpdateField = async () => {
    await renameField({ variables: { fieldId: editingFieldId, fieldName } })

    clearEditField()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      aria-labelledby="edit-fields-dialog-title"
    >
      <DialogTitle id="edit-fields-dialog-title">
        <Trans>Fields</Trans>
      </DialogTitle>
      <Body2>
        <Trans>
          Fields that you can use in your templates and notes. You can add a
          field to a template by typing the @ symbol and the field name
        </Trans>
      </Body2>

      <div className="mt-4 flex flex-col border-t border-divider">
        {fields.map((field) => (
          <div
            key={field.id}
            className={classnames(
              'w-full flex items-center justify-between border-b border-divider py-2 pr-2',
              {
                'pl-2': editingFieldId !== field.id,
              }
            )}
          >
            {editingFieldId === field.id && !isDelete ? (
              <>
                <Input
                  className="w-full min-w-0"
                  ref={inputRef}
                  placeholder={i18n._(t`Field name`)}
                  value={fieldName}
                  onChange={(evt) => setFieldName(evt.target.value)}
                  disabled={updateLoading}
                />

                <div className="flex ml-2">
                  <IconButton onClick={clearEditField} disabled={updateLoading}>
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    className="ml-2"
                    disabled={updateLoading || !fieldName.length}
                    onClick={confirmUpdateField}
                  >
                    <DoneIcon />
                  </IconButton>
                </div>
              </>
            ) : editingFieldId === field.id && isDelete ? (
              <>
                <div className="relative p-2">
                  <WarningIcon
                    className="text-yellow-1"
                    aria-label={i18n._(t`Warning`)}
                  />
                  <div className="bg-yellow-1 opacity-12 absolute top-0 left-0 right-0 bottom-0 rounded-full" />
                </div>

                <div className="flex flex-col w-full ml-3">
                  <Body1>
                    <Trans>
                      Are you sure you want to delete the{' '}
                      <span className="font-medium">{field.name}</span> field?
                    </Trans>
                  </Body1>
                  <Caption>
                    <Trans>
                      This action will delete all values from the notes
                      associated with this model and field
                    </Trans>
                  </Caption>
                </div>

                <div className="flex ml-2">
                  <IconButton onClick={clearEditField} disabled={deleteLoading}>
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    className="ml-2"
                    disabled={deleteLoading}
                    onClick={confirmDeleteField}
                  >
                    <DoneIcon />
                  </IconButton>
                </div>
              </>
            ) : (
              <>
                <Body1>{field.name}</Body1>
                <div className="flex">
                  <IconButton
                    aria-label={i18n._(t`Rename ${field.name} field`)}
                    onClick={() => editField(field)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className="ml-2"
                    aria-label={i18n._(t`Delete ${field.name} field`)}
                    onClick={() => handleDeleteField(field)}
                  >
                    <TrashBinIcon />
                  </IconButton>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {editingFieldId === '' ? (
        <div className="flex items-center justify-between pt-3 pr-2">
          <Input
            className="w-full min-w-0"
            ref={inputRef}
            placeholder={i18n._(t`New field name`)}
            value={fieldName}
            onChange={(evt) => setFieldName(evt.target.value)}
            disabled={createLoading}
          />

          <div className="flex ml-2">
            <IconButton onClick={clearEditField} disabled={createLoading}>
              <ClearIcon />
            </IconButton>

            <IconButton
              className="ml-2"
              onClick={confirmCreateField}
              disabled={createLoading || !fieldName.length}
            >
              <DoneIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <Button className="mt-4" onClick={() => editField()}>
          <AddFieldIcon className="mr-2" />
          <Trans>Add new</Trans>
        </Button>
      )}
    </Dialog>
  )
}

export default EditFieldsDialog
