// Packages
import React from 'react'
// CSS
import classes from './Button.module.scss'

type ButtonPropTypes = {
  name?: string
  className?: string
  style?: {}
  isPlainText?: boolean
  onClick?: (e: React.FormEvent) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const Button: React.FC<ButtonPropTypes> = ({
  name,
  className,
  style,
  isPlainText,
  onClick,
  type,
  disabled,
  children,
}) => {
  let baseClass = `${classes.button}`
  baseClass = isPlainText ? `${baseClass} ${classes.plainText}` : baseClass
  return (
    <button
      name={name}
      className={`${baseClass} ${className}`}
      style={style}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
