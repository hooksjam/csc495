import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import { authentication } from './AuthReducer'
import { registration } from './RegistrationReducer'
import { users } from './UserReducer'
import { alert } from './AlertReducer'
import { form } from './FormReducer'
import { response } from './ResponseReducer'
import { query } from './QueryReducer'
import { study } from './StudyReducer'
import { option } from './OptionReducer'

const rootReducer = (history) => combineReducers({
  router : connectRouter(history),
  authentication,
  registration,
  users,
  alert,
  form,
  response,
  query,
  study,
  option,
});

export default rootReducer;