import React from 'react'

import InputField from './InputField'

const AddDeckForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <InputField name="title" label="Title" />
      <InputField name="description" label="Description" />
    </form>
  )
}

export default AddDeckForm
