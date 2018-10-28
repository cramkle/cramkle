import React from 'react'
import { Field } from 'formik'
import TextField, { Input, HelperText } from '@material/react-text-field'

const InputFieldComponent = ({
  field,
  form: { touched, errors },
  type,
  ...fieldProps
}) => (
  <TextField
    {...fieldProps}
    helperText={
      touched[field.name] && errors[field.name] ? (
        <HelperText validation persistent>
          {errors[field.name]}
        </HelperText>
      ) : null
    }
  >
    <Input type={type} {...field} />
  </TextField>
)

InputFieldComponent.defaultProps = {
  type: 'text',
}

const InputField = props => <Field {...props} component={InputFieldComponent} />

export default InputField
