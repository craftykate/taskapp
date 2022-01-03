// Packages
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'idb-keyval'
// Components
import Footer from 'Components/Layout/Footer/Footer'
// Store
import { StateType, ActionType } from 'Store'

const Layout: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: StateType) => state.darkMode)

  React.useEffect(() => {
    get('darkMode').then((value) =>
      dispatch({ type: ActionType.setTheme, darkMode: value ?? false })
    )
  }, [dispatch])

  return (
    <>
      {darkMode === undefined ? (
        <></>
      ) : (
        <div id='wrapper'>
          <main>{children}</main>
          <Footer dispatch={dispatch} darkMode={darkMode} />
        </div>
      )}
    </>
  )
}

export default Layout
