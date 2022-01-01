// Packages
import React from 'react'
// CSS
import classes from './Tasks.module.scss'
// Components
import TaskList from './TaskList/TaskList'
// Context
import TasksContext from 'Context/tasks-context'
// UI
import Card from 'Components/UI/Card/Card'
import TextButton from 'Components/UI/TextButton/TextButton'

const AddEditTask = React.lazy(
  () => import('Components/Tasks/AddEditTask/AddEditTask')
)

const Tasks = () => {
  const { showAddEditForm, setShowAddEditForm, focusTag, setFocusTag } =
    React.useContext(TasksContext)

  return (
    <>
      {showAddEditForm && <AddEditTask />}
      <Card>
        <div id={classes.links}>
          <TextButton
            id={classes.addTask}
            onClick={() => setShowAddEditForm(true)}
          >
            + Add task
          </TextButton>
          {focusTag && (
            <TextButton onClick={() => setFocusTag()}>Unfocus</TextButton>
          )}
        </div>
        <TaskList />
      </Card>
    </>
  )
}

export default Tasks
