// @Packages
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Auth from '../pages/Auth';

interface IProps { }
const AppRouter: React.FC<IProps> = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Auth} />
      </Switch>
    </BrowserRouter>
  )
};

export default AppRouter;