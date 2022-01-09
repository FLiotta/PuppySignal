// @Packages
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

// @Project
import rootReducer from 'reducers'

const screamMiddleware = (store: any) => (next: any) => (action: any) => {
  console.log("action", action)
  next(action)

  // Middleware para cuando falle la request por token expirado, refrescarlo 
  // https://www.freecodecamp.org/news/what-is-redux-middleware-and-how-to-create-one-from-scratch/
}

export default createStore(rootReducer, applyMiddleware(thunk, screamMiddleware))