import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import NavBar from './Component/NavBar'
import Paid from './Page/Paid'
import Login from './Page/Login'


const styles = () => ({
  open: {
    marginLeft: 240
  }
})

class Router extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.check = this.check.bind(this)
  }
  check(value) {
    if (value !== this.state.open)
      this.setState({ open: value })
  }
  render() {
    const { classes } = this.props
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route path='/' render={() => <NavBar check={this.check} />} />
          <div className={classNames(this.state.open && classes.open)}>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/' component={Paid} />
            </Switch>
          </div>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default withStyles(styles)(Router)
