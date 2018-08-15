import React from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
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
  ListItemText
} from '@material-ui/core'
// import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DoneIcon from '@material-ui/icons/Done'

const drawerWidth = 240

const styles =(theme)=>({
  flex: {
    flexGrow: 1,
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
      <ListItemText primary="已繳系學會費"/>
    </ListItem>
  </Link>
)

class NavBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      open: false
    }
    this.drawerOpen = this.drawerOpen.bind(this)
    this.drawerClose = this.drawerClose.bind(this)
  }
  drawerOpen(){
    this.props.check(true)
    this.setState({open:true})
  }
  drawerClose(){
    this.props.check(false)
    this.setState({open:false})
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
            <Typography variant="title" color="inherit" className={classes.flex}>
              NCTU CS Union
            </Typography>
          </Toolbar>
        </AppBar>
        {LDrawer}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NavBar)
