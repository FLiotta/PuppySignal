// @Packages
import { decode } from 'base-64'
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

// @Project
import App from './App';
import store from './store';
import { name as appName } from './app.json';

// We require to polyfill .atob() because jwt-decode depends on it
// https://github.com/auth0/jwt-decode?tab=readme-ov-file#polyfilling-atob
global.atob = decode;

const Root = () => (
  <Provider store={store}>
    <App />
    <Toast />
  </Provider>
)

AppRegistry.registerComponent(appName, () => Root);
