import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { filterToggle } from '../Redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch,
  Tooltip,
  Button
} from '@material-ui/core'
// import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DoneIcon from '@material-ui/icons/Done'
import axios from 'axios'
import API_URL from '../constants'

axios.defaults.withCredentials = true

const drawerWidth = 240

const styles = (theme) => ({
  flex: {
    flexGrow: 1,
    userSelect: 'none'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
})

const menu = (
  <Link to='/'>
    <ListItem button>
      <ListItemIcon>
        <DoneIcon />
      </ListItemIcon>
      <ListItemText primary="已繳系學會費" />
    </ListItem>
  </Link>
)

class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.drawerOpen = this.drawerOpen.bind(this)
    this.drawerClose = this.drawerClose.bind(this)
  }
  drawerOpen() {
    this.props.check(true)
    this.setState({ open: true })
  }
  drawerClose() {
    this.props.check(false)
    this.setState({ open: false })
  }
  logout() {
    axios.post(`${API_URL}/fee_logout`, {}).then(
      res => {
        window.location.href = '/login'
      }
    )
  }
  render() {
    const { classes } = this.props
    const LDrawer = (
      <Drawer
        variant="persistent"
        open={this.state.open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.drawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {menu}
        </List>
      </Drawer>)

    return (
      <React.Fragment>
        <AppBar position="sticky"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open,
            [classes['appBarShift-left']]: this.state.open,
          })}>
          <Toolbar>
            {/* <IconButton 
              className={classNames(classes.menuButton, this.state.open && classes.hide)} 
              color="inherit" aria-label="Menu" onClick={this.drawerOpen}>
              <MenuIcon />
            </IconButton> */}
            <Typography variant="subtitle1" color="inherit" className={classes.flex}>
              NCTU CS Union
            </Typography>
            {
              this.props.location.pathname === '/' &&
              <Tooltip title={this.props.filter ? '僅顯示已繳系學會費' : '顯示全部'}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.props.filter}
                      onChange={this.props.filterToggle}
                      color="secondary"
                    />
                  }
                  label=""
                />
              </Tooltip>
            }
            {
              this.props.location.pathname !== '/login' &&
              <Button color="inherit" onClick={() => this.logout()}>
                登出
              </Button>
            }
          </Toolbar>
        </AppBar>
        {LDrawer}
      </React.Fragment>
    )
  }
}

const mapState = (state) => ({
  filter: state.filter
})

const mapDispatch = (dispatch) => ({
  filterToggle: () => dispatch(filterToggle())
})

export default withStyles(styles)(connect(mapState, mapDispatch)(withRouter(NavBar)))
