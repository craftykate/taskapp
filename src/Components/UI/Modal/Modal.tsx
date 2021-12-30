// Packages
import React from 'react'
import ReactDOM from 'react-dom'
// CSS
import classes from './Modal.module.scss'
// UI
import Card from 'Components/UI/Card/Card'

type ModalPropTypes = {
  title?: string
  backgroundClose: () => void
}

const Modal: React.FC<ModalPropTypes> = ({
  title,
  backgroundClose,
  children,
}) => {
  return ReactDOM.createPortal(
    <div
      id={classes.modal}
      className={classes.background}
      onClick={backgroundClose}
    >
      <Card
        title={title}
        className={classes.display}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {children}
      </Card>
    </div>,
    document.getElementById('modal-root') as HTMLFormElement
  )
}

export default Modal
