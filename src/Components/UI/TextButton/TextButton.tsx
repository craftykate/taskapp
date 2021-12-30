// CSS
import classes from './TextButton.module.scss'

type TextButtonPropTypes = {
  id?: string
  className?: string
  onClick: () => void
  isPlainText?: boolean
}

const TextButton: React.FC<TextButtonPropTypes> = ({
  id,
  className,
  onClick,
  isPlainText,
  children,
}) => {
  let baseClass = `${classes.textButton}`
  baseClass = isPlainText ? `${baseClass} ${classes.plainText}` : baseClass
  return (
    <span id={id} className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </span>
  )
}

export default TextButton
