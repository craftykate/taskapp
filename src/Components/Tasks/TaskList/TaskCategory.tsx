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
  showUncat?: boolean
  setShowUncat?: (arg1: boolean) => void
  handleDrag: React.DragEventHandler
  handleDrop: React.DragEventHandler
}

const TaskCategory: React.FC<TaskCategoryPropTypes> = ({
  tag,
  tagTasks,
  showUncat,
  setShowUncat,
  handleDrag,
  handleDrop,
}) => {
  const { toggleTagVisibility } = React.useContext(TasksContext)
  const symbol = tag.emoji ? <Emoji symbol={tag.emoji} /> : null
  const showHide = tag.isVisible ? <>&#8897;</> : <>&#8722;</>

  return (
    <>
      {/* Display category name */}
      <tr className={classes.header}>
        <td>{symbol}</td>
        <td>
          {tag.text}{' '}
          <TextButton isPlainText onClick={() => toggleTagVisibility(tag.id)}>
            {showHide}
          </TextButton>
        </td>
        <td></td>
      </tr>
      {tag.isVisible &&
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
