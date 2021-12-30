// Packages
import React from 'react'
// Components
import TagList from './TagList/TagList'
import AddEditTag from './AddEditTag/AddEditTag'
// UI
import Card from 'Components/UI/Card/Card'

const Tags: React.FC = () => {
  return (
    <Card title='Edit Tags'>
      <TagList />
      <AddEditTag />
    </Card>
  )
}

export default Tags
