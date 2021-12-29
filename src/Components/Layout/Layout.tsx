// Components
import Footer from 'Components/Layout/Footer/Footer'

const Layout: React.FC = ({ children }) => {
  return (
    <div id='wrapper'>
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
