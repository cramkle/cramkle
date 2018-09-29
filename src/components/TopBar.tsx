import * as React from 'react'

import TopAppBar from '@material/react-top-app-bar'
import MaterialIcon from '@material/react-material-icon'

import UserInformationCard from './UserInformationCard'

import './TopBar.scss'

const TopBar: React.StatelessComponent = ({ children }) => {
  if (React.Children.count(children) === 0) {
    return null
  }

  return (
    <React.Fragment>
      <TopAppBar
        title="Cramkle"
        navigationIcon={<MaterialIcon icon="menu" />}
        actionItems={[<UserInformationCard key="user" />]}
      />
      <div className="mdc-top-app-bar--fixed-adjust">{children}</div>
    </React.Fragment>
  )
}

TopBar.defaultProps = {
  children: null,
}

export default TopBar
