import React, {Component} from 'react'
import {getUserShort} from '../../utils'

class UserName extends Component {
  state = {isOver: false}
  
  render() {
    const user = this.props.user
    const userShort = getUserShort(user)
    const userLong = (user ? `@${user}` : '...')
    
    return (
      <span className="user-name-short" onMouseOver={() => this.setState({isOver: true})} onMouseOut={() => this.setState({isOver: false})}>
        {this.state.isOver ? userLong : userShort}
      </span>
    )
  }
}


export default UserName