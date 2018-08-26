import {createAction, handleActions } from 'redux-actions'

const initalState = {
  filter: true,
  isLogin: false
}
const filterToggle = createAction('FILTER_TOGGLE')

const Reducer = handleActions({
  FILTER_TOGGLE: (state)=>({...state,filter: !state.filter}),
  LOGIN: (state)=>({...state,isLogin: true})
},initalState)

export {Reducer,filterToggle}