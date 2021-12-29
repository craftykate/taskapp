// Packages
import React from 'react'
import { useLocation } from 'react-router-dom'

export const useScroll = () => {
  const { pathname, hash, key } = useLocation()

  React.useEffect(() => {
    // If not a hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0)
    }
    // Else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          window.scrollTo({
            behavior: 'smooth',
            top: element.offsetTop,
          })
        }
      }, 0)
    }
  }, [pathname, hash, key])
}
