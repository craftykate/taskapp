// Types
import { TagType } from 'Types/task-types'
// UI
import TextButton from 'Components/UI/TextButton/TextButton'

type TagRowPropTypes = {
  tag: TagType
  deleteTag: (id: number) => void
  handleDrag: React.DragEventHandler
  handleDrop: React.DragEventHandler
  setTagToEdit: (id: number) => void
}

const TagRow: React.FC<TagRowPropTypes> = ({
  tag,
  deleteTag,
  handleDrag,
  handleDrop,
  setTagToEdit,
}) => {
  return (
    <tr>
      <td>{tag.emoji}</td>
      <td
        draggable={true}
        id={tag.id.toString()}
        onDragOver={(e) => e.preventDefault()}
        onDragStart={handleDrag}
        onDrop={handleDrop}
      >
        {tag.text}
      </td>
      <td>
        <TextButton onClick={() => setTagToEdit(tag.id)} isPlainText>
          &#x270E;
        </TextButton>
      </td>
    </tr>
  )
}

export default TagRow
