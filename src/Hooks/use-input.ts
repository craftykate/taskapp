import React from 'react'

// ============================================================================
// SET STANDARDS for import by component
//
// How to validate an email address
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// Function for validating string is an email
export const isEmail: ValidateValueType = (value: string) => {
  return !!value.match(EMAIL_REGEX)
}

// How to validate an emoji
const EMOJI_REGEX = /\p{Extended_Pictographic}/gu
// Function for validating string is an emoji
export const isEmoji: ValidateValueType = (value: string) => {
  return !!value.match(EMOJI_REGEX)
}
// Type the validation functions - should be imported by component if they have
// custom validation (more than just required)
// Ex:
// const isEmail: ValidateValueType = (value: string) => {
//   return !!value.match(EMAIL_REGEX)
// }
export type ValidateValueType = { (value: string): boolean }
//
// END STANDARDS
// ============================================================================

// ============================================================================
// REDUCER FUNCTIONS
//
// What initial input state should be
type StateType = {
  value: string
  isTouched: boolean
  isValid: boolean | null
  isRequired: boolean
}
const buildInitialState = (isRequired: boolean): StateType => {
  return {
    value: '',
    isTouched: false,
    isValid: null,
    isRequired,
  }
}

// Action options
enum ActionType {
  input = 'INPUT',
  blur = 'BLUR',
  check = 'CHECK',
  reset = 'RESET',
}
// Parameters the actions can take
type Action =
  | {
      type: ActionType.input
      value: string
    }
  | {
      type: ActionType.blur
      isValid: boolean | null
    }
  | {
      type: ActionType.check
      isValid: boolean | null
    }
  | {
      type: ActionType.reset
    }

// Reducer actions
const inputReducer = (state: StateType, action: Action): StateType => {
  switch (action.type) {
    case ActionType.input: {
      // Just update value and touched when value is changed
      return {
        value: action.value,
        isTouched: true,
        isValid: state.isValid,
        isRequired: state.isRequired,
      }
    }
    case ActionType.blur: {
      // Set the touched and validity states
      return {
        value: state.value,
        isTouched: true,
        isValid: action.isValid,
        isRequired: state.isRequired,
      }
    }
    case ActionType.check: {
      // Just set the validity
      return {
        value: state.value,
        isTouched: state.isTouched,
        isValid: action.isValid,
        isRequired: state.isRequired,
      }
    }
    case ActionType.reset: {
      // Reset all values
      return { ...buildInitialState(state.isRequired) }
    }
    default: {
      throw new Error(`Unhandled action type - ${JSON.stringify(action)}`)
    }
  }
}
//
// END REDUCER FUNCTIONS
// ============================================================================

/**
 * Check if required fields are filled out and use optional function sent from
 * component to see if field is valid that way as well
 *
 * @param isRequired Whether field is required
 * @param value Value of field
 * @param validateValue Function used to further validate field
 * @returns boolean
 */
const checkValidity = (
  isRequired: boolean,
  value: string,
  validateValue?: ValidateValueType
) => {
  let isValid = null
  if (isRequired) {
    isValid = value.trim() !== ''
  }
  if (validateValue && isValid !== false) {
    isValid = validateValue(value)
  }
  return isValid
}

/**
 * Custom hook for managing an input field
 *
 * TODO: Make this compatible with different field types like select. Right now
 * select works on a basic level if you set the requirement to false, but it
 * doesn't validate
 *
 * @param isRequired Is input field required
 * @param validateValue Function used to validate field
 */
const useInput = (isRequired: boolean, validateValue?: ValidateValueType) => {
  // Set up state using reducer
  const [inputState, dispatch] = React.useReducer(
    inputReducer,
    buildInitialState(isRequired)
  )
  const inputRef = React.useRef<any>(null)

  /**
   * Check if field is valid after user pauses.
   * CAN be removed - form will just check for validity on blur and form
   * submission (if the form is set up with showInputError())
   */
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      // Only check if user has entered something
      if (inputState.isTouched) {
        const isValid = checkValidity(
          inputState.isRequired,
          inputState.value,
          validateValue
        )
        dispatch({ type: ActionType.check, isValid })
      }
    }, 1000)

    // Clear the timeout before the next time it is run to keep only one going
    // at a time
    return () => {
      clearTimeout(timeout)
    }
    // Run if user touches input and every time the value changes
  }, [
    inputState.isTouched,
    inputState.value,
    inputState.isRequired,
    validateValue,
  ])

  /**
   * Update state with each keystroke
   */
  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // If it isn't required and it's still blank, treat it like it hasn't been
    // touched yet
    if (!inputState.isRequired && e.target.value === '') {
      dispatch({ type: ActionType.reset })
      return
    }

    dispatch({ type: ActionType.input, value: e.target.value })
  }

  /**
   * Update validity on blur
   */
  const inputBlurHandler = () => {
    // If it isn't required and it's still blank, treat it like it hasn't been
    // touched yet
    if (!inputState.isRequired && inputState.value === '') {
      dispatch({ type: ActionType.reset })
      return
    }

    const isValid = checkValidity(
      inputState.isRequired,
      inputState.value,
      validateValue
    )
    dispatch({ type: ActionType.blur, isValid })
  }

  /**
   * Set of rules for whether input should show an error.
   *
   * An error will show if:
   * * The field is outright invalid (it has already been altered and is still
   *   in valid)
   * * The field is required and has not been marked as valid by the time the
   *   form is submitted
   *
   * Error will go away as soon as the field is no longer invalid.
   * This will ignore blank fields that are not required.
   *
   * @param isSubmitted From form - whether form is submitted
   */
  const showInputError = (isSubmitted: boolean) => {
    const isValid = checkValidity(
      inputState.isRequired,
      inputState.value,
      validateValue
    )
    return (
      (isValid === false && inputState.isTouched) ||
      (inputState.isRequired && !isValid && isSubmitted)
    )
  }

  /**
   * Manually set an input's value
   *
   * @param value Value to set
   */
  const forceInput = (value: string) => {
    dispatch({ type: ActionType.input, value })
  }

  /**
   * Reset field
   */
  const reset = () => {
    dispatch({ type: ActionType.reset })
  }

  return {
    field: {
      value: inputState.value,
      isValid: inputState.isValid,
      isTouched: inputState.isTouched,
      inputRef,
      valueChangeHandler,
      inputBlurHandler,
      showInputError,
      reset,
      forceInput,
    },
  }
}

export default useInput
