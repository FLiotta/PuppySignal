// @Packages
import { BrowserRouter, Switch, Route} from 'react-router-dom';

// @Project
import Found from 'pages/Found';
import NotFound from 'pages/NotFound';

interface IProps { }
const AppRouter: React.FC<IProps> = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/found" component={Found} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
};

export default AppRouter;