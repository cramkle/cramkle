import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog'
import TextField, { Input } from '@material/react-text-field'
import React, { useState } from 'react'

const AddModelForm: React.FunctionComponent<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <Dialog scrimClickAction="dismiss" open={open} onClose={onClose}>
      <DialogTitle>Add model</DialogTitle>
      <DialogContent>
        <TextField className="w-100" label="name">
          <Input<HTMLInputElement>
            name="name"
            value={name}
            onChange={e => {
              // @ts-ignore mcwr typings are messed up?
              setName(e.target.value)
            }}
          />
        </TextField>
      </DialogContent>
      <DialogFooter>
        <DialogButton
          action="create"
          isDefault
          disabled={!name.length || isSubmitting}
          onClick={handleSubmit}
        >
          Create
        </DialogButton>
      </DialogFooter>
    </Dialog>
  )
}

export default AddModelForm
