// Packages
import React from 'react'
// CSS
import classes from './TagList.module.scss'
// Components
import TagRow from './TagRow'
// Context
import TasksContext from 'Context/tasks-context'

const TagList: React.FC = () => {
  const { allTags, sortTags, deleteTag } = React.useContext(TasksContext)
  allTags.sort((a, b) => a.order - b.order)

  const [dragId, setDragId] = React.useState<number>()

  // Set which item is being dragged
  const handleDrag = (e: React.DragEvent) => {
    const target = e.target as HTMLTableCellElement
    setDragId(+target.id)
  }

  // Update tag order when item is done being dragged
  const handleDrop = (e: React.DragEvent) => {
    const target = e.target as HTMLTableCellElement
    if (dragId) {
      const dragItem = allTags.find((item) => item.id === +dragId)
      const dropItem = allTags.find((item) => item.id === +target.id)

      if (dragItem && dropItem) {
        const dragItemOrder = dragItem.order
        const dropItemOrder = dropItem.order

        // TODO: Right now this swaps items, it would be nice to squeeze the
        // item into the spot in the future
        const updatedAllTags = allTags.map((item) => {
          if (item.id === +dragId) {
            item.order = +dropItemOrder
          }
          if (item.id === +target.id) {
            item.order = +dragItemOrder
          }
          return item
        })

        sortTags(updatedAllTags)
      }
    }
  }

  return (
    <div id={classes.tagList}>
      <p className={classes.instructions}>
        Drag a tag name to reorder. Deleting a tag will remove it from all tasks
      </p>
      <table>
        <tbody>
          {allTags.map((tag) => (
            <TagRow
              tag={tag}
              key={tag.id}
              deleteTag={deleteTag}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TagList
