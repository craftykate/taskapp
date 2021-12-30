// Packages
import { Switch, Route, Redirect } from 'react-router-dom'
// Components
import Home from 'Pages/Home'
import Layout from 'Components/Layout/Layout'
import Settings from 'Pages/Settings'
// Hooks
import { useScroll } from 'Hooks/use-scroll'

function App() {
  // Scroll to top of page or down to hash
  useScroll()

  return (
    <Layout>
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
    </Layout>
  )
}

export default App
