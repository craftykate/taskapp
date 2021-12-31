// Packages
import React from 'react'
// CSS
import classes from './TaskList.module.scss'
// Components
import TaskItem from './TaskItem'
// Context
import TasksContext from 'Context/tasks-context'
// Types
import { TagType, TaskType } from 'Types/task-types'
// UI
import Emoji from 'Components/UI/Emoji/Emoji'
import TextButton from 'Components/UI/TextButton/TextButton'

type TaskCategoryPropTypes = {
  tag: TagType | { text: string; emoji: null; isVisible: boolean; id: number }
  tagTasks: TaskType[]
  handleDrag: React.DragEventHandler
  handleDrop: React.DragEventHandler
  focusTag?: number | undefined
}

const TaskCategory: React.FC<TaskCategoryPropTypes> = ({
  tag,
  tagTasks,
  handleDrag,
  handleDrop,
  focusTag,
}) => {
  const { toggleTagVisibility, setFocusTag } = React.useContext(TasksContext)
  const symbol = tag.emoji ? <Emoji symbol={tag.emoji} /> : null
  const header = focusTag ? (
    `Focus: ${tag.text}`
  ) : (
    <TextButton isPlainText onClick={() => setFocusTag(tag.id)}>
      {tag.text}
    </TextButton>
  )
  const toggleSymbol = tag.isVisible ? <>&#8897;</> : <>&#8722;</>
  const toggleButton = focusTag ? null : (
    <TextButton isPlainText onClick={() => toggleTagVisibility(tag.id)}>
      {toggleSymbol}
    </TextButton>
  )

  return (
    <>
      {/* Display category name */}
      <tr className={classes.header}>
        <td>{symbol}</td>
        <td>
          {header} {toggleButton}
        </td>
        <td></td>
      </tr>
      {(tag.isVisible || focusTag) &&
        /* Display all task items under that category */
        tagTasks.map((item, index) => {
          const key = `${item.id}_${index}`
          const isLastRow = index === tagTasks.length - 1
          return (
            <TaskItem
              item={item}
              isLastRow={isLastRow}
              key={key}
              tagId={tag.id}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
            />
          )
        })}
    </>
  )
}

export default TaskCategory
