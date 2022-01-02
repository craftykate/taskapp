// Packages
import React from 'react'
// Components
import AddEditTagForm from './AddEditTagForm'
// Context
import TasksContext from 'Context/tasks-context'
// Hooks
import useInput, { isEmoji } from 'Hooks/use-input'

type AddEditTagPropTypes = {
  tagToEdit?: number | undefined
  setTagToEdit?: (id?: number) => void
}

const AddEditTag: React.FC<AddEditTagPropTypes> = ({
  tagToEdit,
  setTagToEdit,
}) => {
  const { allTags, addTag, updateTag, deleteTag } =
    React.useContext(TasksContext)

  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [formError, setFormError] = React.useState<string>('')
  const [tagInForm, setTagInForm] = React.useState<number>()

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
      if (tagToEdit) {
        // Update tag
        updateTag(tagToEdit, emojiField.value, textField.value)
      } else {
        // Save a new tag
        addTag(emojiField.value, textField.value)
      }
      resetForm()
    } else {
      // Form has errors so set focus on first error and show message
      formHasError.inputRef.current!.focus()
      setFormError('Please fix all errors on form')
    }
  }

  // Delete task then close form
  const deleteTagHandler = () => {
    if (tagToEdit) {
      deleteTag(tagToEdit)
      resetForm()
    }
  }

  // Reset form
  const resetForm = () => {
    setIsSubmitted(false)
    setFormError('')
    if (setTagToEdit) setTagToEdit()

    // Reset all inputs and lose focus
    for (const item in allItems) {
      allItems[item].inputRef.current!.blur()
      allItems[item].reset()
    }
  }

  // When the page first loads or if tag in edit form was changed, check if
  // there's a tag to edit, if so load it into edit form
  React.useEffect(() => {
    if (
      (!emojiField.isTouched && !textField.isTouched) ||
      tagToEdit !== tagInForm
    ) {
      const item = allTags.find((item) => item.id === tagToEdit)
      if (item) {
        if (item.emoji) emojiField.forceInput(item.emoji)
        textField.forceInput(item.text)
        setTagInForm(item.id)
      }
    }
  }, [emojiField, textField, allTags, tagToEdit, tagInForm])

  return (
    <AddEditTagForm
      saveTagHandler={saveTagHandler}
      resetForm={resetForm}
      formError={formError}
      emojiField={emojiField}
      emojiFieldError={emojiFieldError}
      textField={textField}
      textFieldError={textFieldError}
      tagToEdit={tagToEdit}
      deleteTagHandler={deleteTagHandler}
    />
  )
}

export default AddEditTag
