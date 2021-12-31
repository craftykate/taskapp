// Packages
import React from 'react'
// CSS
import classes from './TaskList.module.scss'
// Context
import TasksContext from 'Context/tasks-context'
// Types
import { TaskType } from 'Types/task-types'
// UI
import TextButton from 'Components/UI/TextButton/TextButton'

type TaskItemPropTypes = {
  item: TaskType
  isLastRow?: boolean
  tagId: number
  handleDrag: React.DragEventHandler
  handleDrop: React.DragEventHandler
}

const TaskItem: React.FC<TaskItemPropTypes> = ({
  item,
  isLastRow,
  tagId,
  handleDrag,
  handleDrop,
}) => {
  const { completeTask, setItemToEdit, setShowAddEditForm } =
    React.useContext(TasksContext)

  // Open add/edit form with this task's info
  const launchEdit = () => {
    setItemToEdit(item.id)
    setShowAddEditForm(true)
  }

  const rowClass = isLastRow
    ? `${classes.item} ${classes.lastRow}`
    : `${classes.item}`
  return (
    <tr className={rowClass}>
      <td></td>
      <td>
        <TextButton
          className={!!item.completedAt ? `${classes.completed}` : ''}
          onClick={() => completeTask(item.id)}
          isPlainText
        >
          <span
            draggable={true}
            id={item.id.toString()}
            data-tag={tagId}
            onDragOver={(e) => e.preventDefault()}
            onDragStart={handleDrag}
            onDrop={handleDrop}
          >
            {item.text}
          </span>
        </TextButton>
      </td>
      <td>
        <TextButton onClick={launchEdit} isPlainText>
          &#x270E;
        </TextButton>
      </td>
    </tr>
  )
}

export default TaskItem
