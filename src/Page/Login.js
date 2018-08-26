import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme)=>({
  root: {
    flexGrow: 1,
    fontSize: '1.1em',
    fontWeight: 300
  },
  content: {
    position:'relative',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    position: 'absolute',
    top:'calc( 50vh - 2em )',
    left:'1.4em',
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
    top:'52vh',
    right:'23vw',
    fontSize: '1.1em',
    padding: '1% 3%'
  }
})

const Login = (props)=>{
  const {classes} = props
  return(
    <div className={classes.root}>
      <div className={classes.content}>
          {/* <div className={classes.title}>
              NCTU CS Union
          </div>
        <Button variant="contained" size="large" color="primary" className={classes.button}>
          交大單一入口登入
        </Button> */}
        登入已查看繳費情形...
      </div>
    </div>
  )
}

export default withStyles(styles)(Login)