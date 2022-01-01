// Packages
import React, { Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
// Components
import Home from 'Pages/Home'
import Layout from 'Components/Layout/Layout'
// Hooks
import { useScroll } from 'Hooks/use-scroll'

const Settings = React.lazy(() => import('Pages/Settings'))

function App() {
  // Scroll to top of page or down to hash
  useScroll()

  return (
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/settings'>
            <Settings />
          </Route>
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  )
}

export default App
