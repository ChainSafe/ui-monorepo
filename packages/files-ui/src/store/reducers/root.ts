import { combineReducers } from 'redux'
import auth from './auth/auth'
import drive from './drive/drive'
import fps from './fps/fps'
import billing from './billing/billing'
import toast from './toast/toast'

export default combineReducers({
  auth,
  drive,
  fps,
  toast,
  billing
})
