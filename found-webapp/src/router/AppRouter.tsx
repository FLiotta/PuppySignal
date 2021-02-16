// @Packages
import { BrowserRouter, Switch, Route} from 'react-router-dom';

// @Project
import PrivateRoute from '../components/PrivateRoute';
import BaseLayout from '../components/BaseLayout';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import MyPets from '../pages/MyPets';
import PetOverview from '../pages/PetOverview';
import Logout from '../pages/Logout';
import NotFound from '../pages/NotFound';

interface IProps { }
const AppRouter: React.FC<IProps> = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth" component={Auth} />
        <BaseLayout>
          <Switch>
            <PrivateRoute path="/" component={Dashboard} exact />
            <PrivateRoute path="/my-pets/:id" component={PetOverview} exact />
            <PrivateRoute path="/my-pets" component={MyPets} exact />
            <PrivateRoute path="/logout" component={Logout} />
            <Route component={NotFound} />
          </Switch>
        </BaseLayout>
      </Switch>
    </BrowserRouter>
  )
};

export default AppRouter;