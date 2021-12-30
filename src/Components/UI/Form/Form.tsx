// Packages
import React from 'react'
// CSS
import classes from './Form.module.scss'

type FormPropTypes = {
  title?: string
  className?: string
  onSubmit: (e: React.FormEvent) => void
  onReset: () => void
}

const Form: React.FC<FormPropTypes> = ({
  title,
  className,
  onSubmit,
  onReset,
  children,
}) => {
  return (
    <form
      className={`${classes.form} ${className}`}
      onSubmit={onSubmit}
      onReset={onReset}
    >
      {title && <h3 className={classes.title}>{title}</h3>}

      {children}
    </form>
  )
}

export default Form
