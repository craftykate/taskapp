// Packages
import React from 'react'
// Components
import AddEditTagForm from './AddEditTagForm'
// Context
import TasksContext from 'Context/tasks-context'
// Hooks
import useInput, { isEmoji } from 'Hooks/use-input'

const AddEditTag: React.FC = () => {
  const { addTag } = React.useContext(TasksContext)

  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [formError, setFormError] = React.useState<string>('')

  // Set up each field
  const { field: emojiField } = useInput(false, isEmoji)
  const emojiFieldError = emojiField.showInputError(isSubmitted)
  const { field: textField } = useInput(true)
  const textFieldError = textField.showInputError(isSubmitted)
  // Gather all an an array
  const allItems = [emojiField, textField]

  // Validate form, save if all okay
  const saveTagHandler = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Check for first error on form
    const formHasError = allItems.find(
      (item) => item.showInputError(true) === true
    )

    if (!formHasError) {
      // No errors to process form and reset
      addTag(emojiField.value, textField.value)
      resetForm()
    } else {
      // Form has errors so set focus on first error and show message
      formHasError.inputRef.current!.focus()
      setFormError('Please fix all errors on form')
    }
  }

  // Reset form
  const resetForm = () => {
    setIsSubmitted(false)
    setFormError('')

    // Reset all inputs and lose focus
    for (const item in allItems) {
      allItems[item].inputRef.current!.blur()
      allItems[item].reset()
    }
  }

  return (
    <AddEditTagForm
      saveTagHandler={saveTagHandler}
      resetForm={resetForm}
      formError={formError}
      emojiField={emojiField}
      emojiFieldError={emojiFieldError}
      textField={textField}
      textFieldError={textFieldError}
    />
  )
}

export default AddEditTag
