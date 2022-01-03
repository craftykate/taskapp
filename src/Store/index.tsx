// Packages
import { createStore } from 'redux'
import { set } from 'idb-keyval'

export type StateType = {
  darkMode: boolean | undefined
  focusId: number | undefined
}

const initialState: StateType = {
  darkMode: undefined,
  focusId: undefined,
}

export enum ActionType {
  toggleTheme = 'TOGGLE THEME',
  setTheme = 'SET THEME',
  setFocus = 'SET FOCUS',
}

export type Action =
  | { type: ActionType.toggleTheme }
  | { type: ActionType.setTheme; darkMode: boolean }
  | { type: ActionType.setFocus; focusId: number | undefined }

const themeReducer = (
  state: StateType = initialState,
  action: Action
): StateType => {
  switch (action.type) {
    case ActionType.toggleTheme: {
      const newTheme = !state.darkMode
      set('darkMode', newTheme)
      return {
        darkMode: newTheme,
        focusId: state.focusId,
      }
    }
    case ActionType.setTheme: {
      set('darkMode', action.darkMode)
      return {
        darkMode: action.darkMode,
        focusId: state.focusId,
      }
    }
    case ActionType.setFocus: {
      set('focusId', action.focusId)
      return {
        darkMode: state.darkMode,
        focusId: action.focusId,
      }
    }
    default: {
      return state
    }
  }
}

const store = createStore(themeReducer)

export default store
