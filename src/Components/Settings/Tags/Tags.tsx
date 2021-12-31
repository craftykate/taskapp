// Packages
import React from 'react'
// Components
import TagList from './TagList/TagList'
import AddEditTag from './AddEditTag/AddEditTag'
// UI
import Card from 'Components/UI/Card/Card'

const Tags: React.FC = () => {
  const [tagToEdit, setTagToEdit] = React.useState<number>()

  return (
    <Card title='Edit Tags'>
      <TagList setTagToEdit={setTagToEdit} />
      <AddEditTag tagToEdit={tagToEdit} setTagToEdit={setTagToEdit} />
    </Card>
  )
}

export default Tags
