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
            Site built by <a href='https://katemcfaul.surge.sh'>Kate McFaul</a>
          </li>
          <li>
            <Link to='/settings'>Settings</Link>
          </li>
        </ul>
        <ul>
          <li>
            This site stores all tasks and tags in your browser. If you clear
            your browser data your info will go with it. Accounts will be
            available in the future for a select few!
          </li>
        </ul>
      </footer>
    </>
  )
}

export default React.memo(Footer)
