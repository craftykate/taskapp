// Packages
import React from 'react'
// CSS
import classes from './ResetData.module.scss'
// Context
import TasksContext from 'Context/tasks-context'
// UI
import Card from 'Components/UI/Card/Card'
import Button from 'Components/UI/Button/Button'
import Modal from 'Components/UI/Modal/Modal'

const ResetData: React.FC = () => {
  const { resetAll: resetTaskData } = React.useContext(TasksContext)
  const [showModal, setShowModal] = React.useState<boolean>(false)

  const resetData = () => {
    resetTaskData()
    setShowModal(false)
  }
  return (
    <>
      {showModal && (
        <Modal
          title='Are you sure?'
          backgroundClose={() => setShowModal(false)}
        >
          Are you sure you want to reset all data?
          <div className={classes.confirmButtons}>
            <Button onClick={resetData}>Yes, reset everything</Button>
            <Button onClick={() => setShowModal(false)}>
              Yikes! No, never mind!
            </Button>
          </div>
        </Modal>
      )}
      <Card title='Reset Data'>
        <p>Reset all tasks and tags back to default</p>
        <p>
          <Button onClick={() => setShowModal(true)}>Reset Data</Button>
        </p>
      </Card>
    </>
  )
}

export default ResetData
