// @Packages
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

// @Project
import rootReducer from 'reducers'

export default createStore(rootReducer, applyMiddleware(thunk))