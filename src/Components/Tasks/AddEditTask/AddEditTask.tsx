// Packages
import React from 'react'
// Components
import AddEditTaskForm from './AddEditTaskForm'
// Context
import TasksContext from 'Context/tasks-context'
// Hooks
import useInput from 'Hooks/use-input'

const AddEditTask: React.FC = () => {
  const {
    addTask,
    allTags,
    setShowAddEditForm,
    itemToEdit,
    setItemToEdit,
    allTasks,
    updateTask,
    deleteTask,
  } = React.useContext(TasksContext)

  // Form states - isSubmitted is necessary for handling errors
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [formError, setFormError] = React.useState<string>('')
  const [chosenTags, setChosenTags] = React.useState<string[]>([])
  const catTags = allTags
    .filter((tag) => tag.id !== 0)
    .sort((a, b) => a.order - b.order)

  // Set up each field
  const { field: textField } = useInput(true)
  const textFieldError = textField.showInputError(isSubmitted)
  // Gather all in an array
  const allItems = [textField]

  // Add or remove tag from list of selected tags when clicked
  const updateTags = (id: string) => {
    setChosenTags((prevState) => {
      let prevStateCopy = [...prevState]
      if (prevStateCopy.includes(id)) {
        prevStateCopy = prevStateCopy.filter((tagId) => tagId !== id)
      } else {
        prevStateCopy.push(id)
      }
      return prevStateCopy
    })
  }

  // Validate form, save if all okay
  const saveTaskHandler = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Check for first error on form
    const formHasError = allItems.find(
      (item) => item.showInputError(true) === true
    )

    if (!formHasError) {
      // No errors to process form and reset
      if (itemToEdit) {
        // Update task
        updateTask(itemToEdit, textField.value, chosenTags)
      } else {
        // Save a new task
        addTask(textField.value, chosenTags)
      }
      resetForm()
    } else {
      // Form has errors so set focus on first error and show message
      formHasError.inputRef.current!.focus()
      setFormError('Please fix all errors on form')
    }
  }

  // Delete task then close form
  const deleteItemHandler = () => {
    if (itemToEdit) {
      deleteTask(itemToEdit)
      resetForm()
    }
  }

  // Reset form
  const resetForm = () => {
    setShowAddEditForm(false)
    setIsSubmitted(false)
    setFormError('')
    setChosenTags([])
    setItemToEdit()

    // Reset all inputs and lose focus
    for (const item in allItems) {
      allItems[item].inputRef.current!.blur()
      allItems[item].reset()
    }
  }

  // When the page first loads see if there's an item to edit, if so load those details
  React.useEffect(() => {
    if (!textField.isTouched) {
      const item = allTasks.find((item) => item.id === itemToEdit)
      if (item) {
        textField.forceInput(item.text)
        setChosenTags(Object.keys(item.order))
      }
    }
  }, [textField, allTasks, itemToEdit])

  return (
    <AddEditTaskForm
      saveTaskHandler={saveTaskHandler}
      resetForm={resetForm}
      formError={formError}
      textFieldError={textFieldError}
      textField={textField}
      allTags={catTags}
      chosenTags={chosenTags}
      updateTags={updateTags}
      itemToEdit={itemToEdit}
      deleteItemHandler={deleteItemHandler}
    />
  )
}

export default AddEditTask
