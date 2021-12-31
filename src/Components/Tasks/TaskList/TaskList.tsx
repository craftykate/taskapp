// Packages
import React from 'react'
// CSS
import classes from './TaskList.module.scss'
// Components
import TaskCategory from './TaskCategory'
// Context
import TasksContext from 'Context/tasks-context'

const TaskList: React.FC = () => {
  const { allTasks, allTags } = React.useContext(TasksContext)
  const [showUncat, setShowUncat] = React.useState(true)

  allTags.sort((a, b) => a.order - b.order)
  const noCatItems = allTasks.filter((task) => {
    return task.tags.length === 0
  })
  return (
    <table id={classes.taskTable}>
      <tbody>
        {allTags.map((tag) => {
          const tagItems = allTasks.filter((item) => item.tags.includes(tag.id))
          return <TaskCategory tag={tag} tagTasks={tagItems} key={tag.id} />
        })}
        {noCatItems.length > 0 && (
          <TaskCategory
            tag={{
              text: 'Uncategorized',
              emoji: null,
              isVisible: showUncat,
              id: -1,
            }}
            showUncat={showUncat}
            setShowUncat={setShowUncat}
            tagTasks={noCatItems}
          />
        )}
      </tbody>
    </table>
  )
}

export default TaskList
