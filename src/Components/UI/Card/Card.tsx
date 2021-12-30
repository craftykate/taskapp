// Packages
import React from 'react'
// CSS
import classes from './Card.module.scss'

type CardPropTypes = {
  className?: string
  title?: string
  onClick?: (arg: any) => void
}

const Card: React.FC<CardPropTypes> = ({
  className,
  title,
  onClick,
  children,
}) => {
  const sectionTitle = title ? <h3 className={classes.title}>{title}</h3> : null
  return (
    <section className={`${classes.card} ${className}`} onClick={onClick}>
      {sectionTitle}
      {children}
    </section>
  )
}

export default Card
