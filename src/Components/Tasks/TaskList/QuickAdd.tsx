// Packages
import React from 'react'
// Context
import TasksContext from 'Context/tasks-context'
// Hooks
import useInput from 'Hooks/use-input'
// UI
import Form from 'Components/UI/Form/Form'

const QuickAdd: React.FC = () => {
  const { addTask, focusTag, allTags } = React.useContext(TasksContext)

  // Set up each field
  const { field: textField } = useInput(true)
  // Gather all in an array
  const allItems = [textField]

  const saveTaskHandler = (e: React.FormEvent) => {
    e.preventDefault()
    const tag = allTags.find((tag) => tag.id === focusTag)
    if (tag) addTask(textField.value, [tag.id.toString()])
    resetForm()
  }

  const resetForm = () => {
    // Reset all inputs and lose focus
    for (const item in allItems) {
      allItems[item].inputRef.current!.blur()
      allItems[item].reset()
    }
  }
  return (
    <tr>
      <td></td>
      <td>
        <Form onSubmit={saveTaskHandler} onReset={resetForm}>
          <input
            type='text'
            id='text'
            name='text'
            value={textField.value}
            onChange={textField.valueChangeHandler}
            style={{ width: '100%' }}
            placeholder='Quick Add &#8617;'
            ref={textField.inputRef}
          />
        </Form>
      </td>
      <td></td>
    </tr>
  )
}

export default QuickAdd
