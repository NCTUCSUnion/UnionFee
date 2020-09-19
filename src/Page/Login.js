import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  InputLabel,
  TextField,
  Button
} from '@material-ui/core'
import axios from 'axios'

axios.defaults.withCredentials = true

const URL = 'http://localhost:8080'
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    fontSize: '1.1em',
    fontWeight: 300
  },
  content: {
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    position: 'absolute',
    top: 'calc( 50vh - 2em )',
    left: '1.4em',
    fontSize: '4em',
    fontWeight: '500',
    color: '#666',
    paddingLeft: '0.3em',
    borderLeft: '10px solid #2196f3',
    userSelect: 'none',
  },
  button: {
    display: 'block',
    position: 'absolute',
    top: '52vh',
    right: '23vw',
    fontSize: '1.1em',
    padding: '1% 3%'
  },
  container: {
    margin: '0 auto',
    width: 'fit-content',
    backgroundColor: '#f5f5f5',
    boxShadow: '1px 1px 2px #999999',
    padding: '20px',
    borderRadius: '.7rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: '10px'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: '5px'
  }
})

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  tryLogin() {
    axios.post(`${URL}/_api/fee_auth`, {
      username: this.state.username,
      password: this.state.password
    }).then(
      res => {
        if (res.data)
          window.location.href = '/'
        else
          window.location.reload()
      }
    )
  }

  handleUsernameChange(evt) {
    const password = this.state.password
    this.setState({
      username: evt.target.value,
      password: password
    })
  }

  handlePasswordChange(evt) {
    const username = this.state.username
    this.setState({
      username: username,
      password: evt.target.value
    })
  }

  render() {
    axios.post(`${URL}/_api/fee_check`, {}).then(
      res => {
        if (res.data)
          window.location.href = '/'
      }
    )
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.container}>
            <div className={classes.column}>
              <div className={classes.row}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <TextField id="username" name="username" aria-describedby="Username" onChange={evt => this.handleUsernameChange(evt)} />
              </div>
              <div className={classes.row}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <TextField id="password" name="password" aria-describedby="Password" type="password" onChange={evt => this.handlePasswordChange(evt)} />
              </div>
              <Button type="button" variant="outlined" color="primary" onClick={() => this.tryLogin()}>
                登入
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Login)