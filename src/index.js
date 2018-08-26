import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {blue,pink} from '@material-ui/core/colors/'
import './index.css'
import {Reducer} from './Redux'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import Router from './Router'
import registerServiceWorker from './registerServiceWorker'

const store = createStore(Reducer)

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary:pink,
  },
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <Router />
    </Provider>
  </MuiThemeProvider>, document.getElementById('root'))

registerServiceWorker()
