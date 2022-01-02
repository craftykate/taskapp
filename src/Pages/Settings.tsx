// Packages
import { useHistory } from 'react-router'
// Components
import Tags from 'Components/Tags/Tags'
import ResetData from 'Components/ResetData/ResetData'
// UI
import Button from 'Components/UI/Button/Button'

const Settings: React.FC = () => {
  const history = useHistory()
  const backText = 'Back Home'

  return (
    <>
      <Button onClick={history.goBack} style={{ marginBottom: '10px' }}>
        {backText}
      </Button>
      <Tags />
      <ResetData />
    </>
  )
}

export default Settings
