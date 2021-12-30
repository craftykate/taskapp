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
}

const TaskItem: React.FC<TaskItemPropTypes> = ({ item, isLastRow }) => {
  const { completeTask, deleteTask, setItemToEdit, setShowAddEditForm } =
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
      <td>
        <TextButton onClick={launchEdit} isPlainText>
          &#x270E;
        </TextButton>
      </td>
      <td>
        <TextButton
          className={!!item.completedAt ? `${classes.completed}` : ''}
          onClick={() => completeTask(item.id)}
          isPlainText
        >
          {item.text}
        </TextButton>
      </td>
      <td>
        <TextButton onClick={() => deleteTask(item.id)} isPlainText>
          &#10005;
        </TextButton>
      </td>
    </tr>
  )
}

export default TaskItem