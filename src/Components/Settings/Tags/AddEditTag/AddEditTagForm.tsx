// CSS
import classes from './AddEditTag.module.scss'
import formClasses from 'Components/UI/Form/Form.module.scss'
// UI
import Form from 'Components/UI/Form/Form'
import Message from 'Components/UI/Message/Message'
import Button from 'Components/UI/Button/Button'

type AddEditTagFormPropTypes = {
  saveTagHandler: (e: React.FormEvent) => void
  resetForm: () => void
  formError: string
  emojiField: {
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
  emojiFieldError: boolean
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
  textFieldError: boolean
  tagToEdit: number | undefined
}

const AddEditTagForm: React.FC<AddEditTagFormPropTypes> = ({
  saveTagHandler,
  resetForm,
  formError,
  emojiField,
  emojiFieldError,
  textField,
  textFieldError,
  tagToEdit,
}) => {
  return (
    <Form
      title={tagToEdit ? 'Edit Tag' : 'Add New Tag'}
      className={classes.addTag}
      onSubmit={saveTagHandler}
      onReset={resetForm}
    >
      <p className={classes.instructions}>Emoji is optional, limit to 1</p>
      {formError && <Message type='error'>{formError}</Message>}
      {emojiFieldError && (
        <div className={formClasses.fieldError}>Must be an emoji - limit 1</div>
      )}
      {textFieldError && (
        <div className={formClasses.fieldError}>Tag name is required</div>
      )}
      <div className={formClasses.row}>
        <input
          type='text'
          id='emoji'
          name='emoji'
          value={emojiField.value}
          className={emojiFieldError ? formClasses.invalid : ''}
          onChange={emojiField.valueChangeHandler}
          onBlur={emojiField.inputBlurHandler}
          placeholder='Emoji'
          ref={emojiField.inputRef}
          size={7}
        />
        <input
          type='text'
          id='text'
          name='text'
          value={textField.value}
          className={textFieldError ? formClasses.invalid : ''}
          onChange={textField.valueChangeHandler}
          onBlur={textField.inputBlurHandler}
          placeholder='*Tag Name'
          ref={textField.inputRef}
        />
        <Button type='submit'>{tagToEdit ? 'Save Tag' : 'Add Tag'}</Button>
        <Button type='reset' isPlainText>
          Cancel
        </Button>
      </div>
    </Form>
  )
}

export default AddEditTagForm
