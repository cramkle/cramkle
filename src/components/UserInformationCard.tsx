import * as React from 'react'
import { connect } from 'react-redux'

import MaterialIcon from '@material/react-material-icon'
import Button from '@material/react-button'
import { CardActions, CardActionButtons } from '@material/react-card'

import { userLogoutRequest } from '../actions/auth'
import { getUser } from '../selectors/user'

interface UserInformationCardProps {
  user: {
    username: string
  }
  logout: () => {}
  className?: string
}

interface UserInformationCardState {
  showCard: boolean
}

class UserInformationCard extends
  React.Component<UserInformationCardProps, UserInformationCardState> {

  static defaultProps = {
    user: {},
  }

  private cardRef: React.RefObject<HTMLDivElement> = React.createRef()

  state = {
    showCard: false,
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  handleDocumentClick = e => {
    const { showCard } = this.state

    if (this.cardRef.current && !this.cardRef.current.contains(e.target)) {
      if (showCard) {
        this.setState({
          showCard: false,
        })

        this.removeListeners()
      }
    }
  }

  handleIconClick = () => {
    this.setState({
      showCard: true,
    })

    document.addEventListener('click', this.handleDocumentClick)
  }

  removeListeners() {
    document.removeEventListener('click', this.handleDocumentClick)
  }

  render() {
    const { user, logout, className } = this.props
    const { showCard } = this.state

    return (
      <div className="user-popup">
        <MaterialIcon
          className={className}
          icon="account_circle"
          onClick={this.handleIconClick}
        />
        {showCard && (
          <div className="mdc-card user-popup__card" ref={this.cardRef}>
            <div className="user-popup__card-content">
              <span className="mdc-typography--body2">
                Hello, {user.username}
              </span>
            </div>
            <CardActions>
              <CardActionButtons>
                <Button onClick={logout}>Log out</Button>
              </CardActionButtons>
            </CardActions>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: getUser(state),
})

export default connect(
  mapStateToProps,
  { logout: userLogoutRequest }
)(UserInformationCard)
