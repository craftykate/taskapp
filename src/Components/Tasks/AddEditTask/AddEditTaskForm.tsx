// CSS
import classes from './AddEditTask.module.scss'
import formClasses from 'Components/UI/Form/Form.module.scss'
// Types
import { TagType } from 'Types/task-types'
// UI
import Form from 'Components/UI/Form/Form'
import Button from 'Components/UI/Button/Button'
import Message from 'Components/UI/Message/Message'
import TextButton from 'Components/UI/TextButton/TextButton'
import Modal from 'Components/UI/Modal/Modal'
import AddEditTag from 'Components/Tags/AddEditTag/AddEditTag'

type AddEditTaskFormPropTypes = {
  saveTaskHandler: (e: React.FormEvent) => void
  resetForm: () => void
  formError: string
  textFieldError: boolean
  textField: {
    value: string
    isValid: boolean | null
    isTouched: boolean
    inputRef: React.MutableRefObject<any>
    valueChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
    inputBlurHandler: () => void
    showInputError: (isSubmitted: boolean) => boolean
    reset: () => void
    forceInput: (value: string) => void
  }
  allTags: TagType[]
  chosenTags: string[]
  updateTags: (id: string) => void
  itemToEdit: number | undefined
  deleteItemHandler: () => void
}

const AddEditTaskForm: React.FC<AddEditTaskFormPropTypes> = ({
  saveTaskHandler,
  resetForm,
  formError,
  textFieldError,
  textField,
  allTags,
  chosenTags,
  updateTags,
  itemToEdit,
  deleteItemHandler,
}) => {
  return (
    <Modal
      backgroundClose={resetForm}
      title={itemToEdit ? 'Edit Task' : 'Add Task'}
    >
      <Form
        onSubmit={saveTaskHandler}
        onReset={resetForm}
        className={classes.addForm}
      >
        {formError && <Message type='error'>{formError}</Message>}
        <div className={formClasses.row}>
          {textFieldError && (
            <div className={formClasses.fieldError}>
              Task description is required
            </div>
          )}
          <input
            type='text'
            id='text'
            name='text'
            value={textField.value}
            className={textFieldError ? formClasses.invalid : ''}
            onChange={textField.valueChangeHandler}
            onBlur={textField.inputBlurHandler}
            placeholder='*Task Name'
            ref={textField.inputRef}
          />
        </div>
        <div id={classes.tagDiv}>
          <p>Optional Tags: </p>
          <div id={classes.tags}>
            {allTags.map((priority) => {
              const isChosen = chosenTags.includes(priority.id.toString())
                ? `${classes.chosen}`
                : ''
              return (
                <TextButton
                  className={`${classes.tag} ${isChosen}`}
                  onClick={() => updateTags(priority.id.toString())}
                  key={priority.id}
                >
                  #{priority.text}
                </TextButton>
              )
            })}
          </div>
        </div>
        <div className={formClasses.submitButtons}>
          <Button type='submit'>{itemToEdit ? 'Save Task' : 'Add Task'}</Button>
          <Button isPlainText type='reset'>
            Cancel
          </Button>
        </div>
      </Form>
      <AddEditTag />
      {itemToEdit && (
        <Button id={classes.deleteTask} onClick={deleteItemHandler}>
          Delete Task
        </Button>
      )}
    </Modal>
  )
}

export default AddEditTaskForm
