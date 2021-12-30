// Types
import { TagType } from 'Types/task-types'
// UI
import TextButton from 'Components/UI/TextButton/TextButton'

type TagRowPropTypes = {
  tag: TagType
  deleteTag: (id: number) => void
  handleDrag: React.DragEventHandler
  handleDrop: React.DragEventHandler
}

const TagRow: React.FC<TagRowPropTypes> = ({
  tag,
  deleteTag,
  handleDrag,
  handleDrop,
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
        <TextButton onClick={() => deleteTag(tag.id)} isPlainText>
          &#10005;
        </TextButton>
      </td>
    </tr>
  )
}

export default TagRow
