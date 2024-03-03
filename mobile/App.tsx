// @Packages
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// @Projects
import { IRootState } from './store';
import AuthView from './views/Auth';
import SplashView from './views/Splash';
import TabNavigator from './views/TabNavigator';


const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state: IRootState) => state.app.authenticated)

  if (loading) {
    return <SplashView onFinish={() => setLoading(false)} />
  } else if (!isAuthenticated) {
    return <AuthView />
  } else {
    return <TabNavigator />
  }
}

export default App;
