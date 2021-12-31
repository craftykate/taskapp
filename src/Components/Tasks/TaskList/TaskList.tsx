// Packages
import React from 'react'
// CSS
import classes from './TaskList.module.scss'
// Components
import TaskCategory from './TaskCategory'
// Context
import TasksContext from 'Context/tasks-context'

const TaskList: React.FC = () => {
  const { allTasks, allTags, sortTasks, focusTag } =
    React.useContext(TasksContext)
  const [dragId, setDragId] = React.useState<number>()
  const [dragCat, setDragCat] = React.useState<string>()

  const catTags = allTags.filter((tag) => {
    return focusTag ? tag.id === focusTag : tag.id > 0
  })
  catTags.sort((a, b) => a.order - b.order)

  const noCatTag = allTags.find((tag) => tag.id === 0)
  const noCatItems = allTasks.filter((task) =>
    Object.keys(task.order).includes('0')
  )
  noCatItems.sort((a, b) => a.order['0'] - b.order['0'])

  // Set which item is being dragged
  const handleDrag = (e: React.DragEvent) => {
    const target = e.target as HTMLTableCellElement

    if (target.dataset.tag) {
      setDragId(+target.id)
      setDragCat(target.dataset.tag)
    }
  }

  // Update tag order when item is done being dragged
  const handleDrop = (e: React.DragEvent) => {
    const target = e.target as HTMLTableCellElement
    const dropCat = target.dataset.tag

    if (dragId) {
      const dragItem = allTasks.find((item) => item.id === +dragId)
      const dropItem = allTasks.find((item) => item.id === +target.id)

      if (
        dragItem &&
        dropItem &&
        dragCat &&
        dropCat &&
        dragCat === dropCat &&
        dragCat !== '-1'
      ) {
        const dragItemOrder = dragItem.order[dragCat]
        const dropItemOrder = dropItem.order[dropCat]

        const moveDirection = dragItemOrder > dropItemOrder ? 'up' : 'down'
        const modifier = moveDirection === 'up' ? 1 : -1

        const updatedAllTasks = allTasks.map((item) => {
          if (item.id === +dragId) {
            item.order[dragCat] = +dropItemOrder
          } else {
            // If item is between the drag and drop spot OR it is the drop spot,
            // update the value
            if (
              (moveDirection === 'up' &&
                item.order[dragCat] > dropItemOrder &&
                item.order[dragCat] < dragItemOrder) ||
              (moveDirection === 'down' &&
                item.order[dragCat] < dropItemOrder &&
                item.order[dragCat] > dragItemOrder) ||
              item.order[dragCat] === dropItemOrder
            ) {
              item.order[dragCat] = item.order[dragCat] + modifier
            }
          }
          return item
        })

        sortTasks(updatedAllTasks)
      }
    }
  }

  return (
    <table id={classes.taskTable}>
      <tbody>
        {catTags.map((tag) => {
          const tagItems = allTasks.filter((item) =>
            Object.keys(item.order).includes(tag.id.toString())
          )
          tagItems.sort(
            (a, b) => a.order[tag.id.toString()] - b.order[tag.id.toString()]
          )
          return (
            <TaskCategory
              tag={tag}
              tagTasks={tagItems}
              key={tag.id}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              focusTag={focusTag}
            />
          )
        })}
        {!focusTag && noCatTag && noCatItems.length > 0 && (
          <TaskCategory
            tag={noCatTag}
            tagTasks={noCatItems}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
          />
        )}
      </tbody>
    </table>
  )
}

export default TaskList
