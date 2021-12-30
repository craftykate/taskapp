// Packages
import React from 'react'
// CSS
import classes from './Tasks.module.scss'
// Components
import TaskList from './TaskList/TaskList'
import AddEditTask from 'Components/Tasks/AddEditTask/AddEditTask'
// Context
import TasksContext from 'Context/tasks-context'
// UI
import Card from 'Components/UI/Card/Card'
import TextButton from 'Components/UI/TextButton/TextButton'

const Tasks = () => {
  const { showAddEditForm, setShowAddEditForm } = React.useContext(TasksContext)

  return (
    <>
      {showAddEditForm && <AddEditTask />}
      <Card>
        <TextButton
          id={classes.addTask}
          onClick={() => setShowAddEditForm(true)}
        >
          Add task
        </TextButton>
        <TaskList />
      </Card>
    </>
  )
}

export default Tasks
