// CSS
import classes from './Message.module.scss'

type MessagePropTypes = {
  type: 'error' | 'success' | 'info'
}

const Message: React.FC<MessagePropTypes> = ({ type, children }) => {
  return (
    <div className={`${classes.message} ${classes[type]}`}>
      <span>{children}</span>
    </div>
  )
}

export default Message
