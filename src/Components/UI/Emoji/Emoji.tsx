// CSS
import classes from './Emoji.module.scss'

type EmojiPropTypes = {
  symbol: string
}

const Emoji: React.FC<EmojiPropTypes> = ({ symbol }) => {
  return (
    <span role='img' className={classes.emoji}>
      {symbol}
    </span>
  )
}

export default Emoji
