import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {blue,pink} from '@material-ui/core/colors/'
import './index.css'
import Router from './Router'
import registerServiceWorker from './registerServiceWorker'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary:pink
  },
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Router />
  </MuiThemeProvider>, document.getElementById('root'))
registerServiceWorker()
