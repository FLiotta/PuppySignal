// @Packages
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import Cookie from 'universal-cookie';

// @Project
import store from './store';
import { reconnect } from './actions/session';
import { fetchSpecies } from './actions/species';
import AppRouter from './router/AppRouter';
import './styles/app.scss';

// @Initialization
const cookie = new Cookie();
const previousToken = cookie.get('token');

store.dispatch(fetchSpecies());

if(previousToken) {
  store.dispatch(reconnect(previousToken));
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
