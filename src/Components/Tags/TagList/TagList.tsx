// Packages
import React from 'react'
// CSS
import classes from './TagList.module.scss'
// Components
import TagRow from './TagRow'
// Context
import TasksContext from 'Context/tasks-context'

type TagListPropTypes = {
  setTagToEdit: (id: number) => void
}

const TagList: React.FC<TagListPropTypes> = ({ setTagToEdit }) => {
  const { allTags, sortTags, deleteTag } = React.useContext(TasksContext)
  const catTags = allTags.filter((tag) => tag.id !== 1)
  catTags.sort((a, b) => a.order - b.order)

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

        const moveDirection = dragItemOrder > dropItemOrder ? 'up' : 'down'
        const modifier = moveDirection === 'up' ? 1 : -1

        const updatedAllTags = allTags.map((item) => {
          if (item.id === +dragId) {
            item.order = +dropItemOrder
          } else {
            // If item is between the drag and drop spot OR it is the drop spot,
            // update the value
            if (
              (moveDirection === 'up' &&
                item.order > dropItemOrder &&
                item.order < dragItemOrder) ||
              (moveDirection === 'down' &&
                item.order < dropItemOrder &&
                item.order > dragItemOrder) ||
              item.order === dropItemOrder
            ) {
              item.order = item.order + modifier
            }
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
          {catTags.map((tag) => (
            <TagRow
              tag={tag}
              key={tag.id}
              deleteTag={deleteTag}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              setTagToEdit={setTagToEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TagList
