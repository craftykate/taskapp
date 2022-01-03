// Packages
import React from 'react'
import { Link } from 'react-router-dom'
// CSS
import classes from './Footer.module.scss'
// Store
import { Action, ActionType } from 'Store/index'
// UI
import TextButton from 'Components/UI/TextButton/TextButton'

type FooterPropTypes = {
  dispatch: (action: Action) => void
  darkMode: boolean | undefined
}
const Footer: React.FC<FooterPropTypes> = ({ dispatch, darkMode }) => {
  const themeLink = darkMode ? 'Go light' : 'Go dark'

  return (
    <>
      <footer id={classes.footer}>
        <ul>
          <li>
            <Link to='/settings'>Settings</Link>
          </li>
          {process.env.REACT_APP_ENV === 'LOCAL' && (
            <li>
              <TextButton
                isPlainText
                className={classes.footerLink}
                onClick={() => dispatch({ type: ActionType.toggleTheme })}
              >
                {themeLink}
              </TextButton>
            </li>
          )}
        </ul>
        <ul>
          <li>
            Works offline! Save me to your desktop or mobile home screen for
            easy access, no internet required.
          </li>
        </ul>
        <ul>
          <li>
            This site stores all tasks and tags in your browser. Clearing your
            cache will reset your tasks.
          </li>
        </ul>
        <ul>
          <li>
            Site built by <a href='https://katemcfaul.surge.sh'>Kate McFaul</a>
          </li>
        </ul>
      </footer>
    </>
  )
}

export default React.memo(Footer)
