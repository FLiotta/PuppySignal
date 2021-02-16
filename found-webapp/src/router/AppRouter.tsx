// @Packages
import { BrowserRouter, Switch, Route} from 'react-router-dom';

// @Project
import BaseLayout from '../components/BaseLayout';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import MyPets from '../pages/MyPets';
import PetOverview from '../pages/PetOverview';

interface IProps { }
const AppRouter: React.FC<IProps> = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <BaseLayout>
          <Switch>
            <Route path="/home" component={Dashboard} />
            <Route path="/my-pets/:id" component={PetOverview} exact />
            <Route path="/my-pets" component={MyPets} exact />
          </Switch>
        </BaseLayout>
        <Route path="/auth" component={Auth} />
      </Switch>
    </BrowserRouter>
  )
};

export default AppRouter;