import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { authentication } from './AuthReducer';
import { registration } from './RegistrationReducer';
import { users } from './UserReducer';
import { alert } from './AlertReducer';
import { form } from './FormReducer';
import { query } from './QueryReducer';

const rootReducer = (history) => combineReducers({
  router : connectRouter(history),
  authentication,
  registration,
  users,
  alert,
  form,
  query
});

export default rootReducer;