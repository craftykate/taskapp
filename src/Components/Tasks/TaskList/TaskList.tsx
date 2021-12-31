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

  const noCatItems = allTasks.filter((task) =>
    Object.keys(task.order).includes('blank')
  )
  noCatItems.sort((a, b) => a.order.blank - b.order.blank)
  return (
    <table id={classes.taskTable}>
      <tbody>
        {allTags.map((tag) => {
          const tagItems = allTasks.filter((item) =>
            Object.keys(item.order).includes(tag.id.toString())
          )
          tagItems.sort(
            (a, b) => a.order[tag.id.toString()] - b.order[tag.id.toString()]
          )
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
