// Packages
import React from 'react'
import { Link } from 'react-router-dom'
// CSS
import classes from './Footer.module.scss'

const Footer: React.FC = () => {
  return (
    <>
      <footer id={classes.footer}>
        <ul>
          <li>
            <Link to='/settings'>Settings</Link>
          </li>
          <li>
            Site built by <a href='https://katemcfaul.surge.sh'>Kate McFaul</a>
          </li>
        </ul>
        <ul>
          <li>
            Works offline! Save me to your desktop or mobile home screen for
            easy access, no internet required.
          </li>
        </ul>
        <ul>
          <li>
            This site stores all tasks and tags in your browser. If you clear
            your browser data your info will go with it.
          </li>
        </ul>
      </footer>
    </>
  )
}

export default React.memo(Footer)
