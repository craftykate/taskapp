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
  const showHide =
    tag.text !== 'Uncategorized' ? (
      tag.isVisible ? (
        <TextButton isPlainText onClick={() => toggleTagVisibility(tag.id)}>
          &#8897;
        </TextButton>
      ) : (
        <TextButton isPlainText onClick={() => toggleTagVisibility(tag.id)}>
          &#8722;
        </TextButton>
      )
    ) : setShowUncat ? (
      showUncat ? (
        <TextButton isPlainText onClick={() => setShowUncat(false)}>
          &#8897;
        </TextButton>
      ) : (
        <TextButton isPlainText onClick={() => setShowUncat(true)}>
          &#8722;
        </TextButton>
      )
    ) : null
  return (
    <>
      {/* Display category name */}
      <tr className={classes.header}>
        <td>{symbol}</td>
        <td>
          {tag.text} {showHide}
        </td>
        <td></td>
      </tr>
      {((tag.text !== 'Uncategorized' && tag.isVisible) ||
        (tag.text === 'Uncategorized' && showUncat)) &&
        /* Display all to do items under that category */
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
