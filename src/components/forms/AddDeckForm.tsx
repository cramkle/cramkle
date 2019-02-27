import React from 'react'

import InputField from './InputField'

interface Props {
  onSubmit: () => void
}

const AddDeckForm: React.FunctionComponent<Props> = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <InputField name="title" label="Title" />
      <InputField name="description" label="Description" />
    </form>
  )
}

export default AddDeckForm
