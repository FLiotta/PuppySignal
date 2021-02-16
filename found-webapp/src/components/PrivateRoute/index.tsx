// @Packages
import cogoToast from 'cogo-toast';
import { useSelector } from 'react-redux';
import { Redirect, RouteComponentProps, Route } from 'react-router-dom';

// @Project
import { selectSessionToken } from '../../selectors/session';

interface IProps { 
  component: any,
  path?: string
  exact?: boolean,
};

const PrivateRoute: React.FC<IProps> = ({
  component: Component,
  ...rest
}) => {
  const token = useSelector(selectSessionToken);

  const validateSession: Function = (): React.ReactNode => {
    if(token) {
      return (
        <Route 
          {...rest} 
          render={(props: RouteComponentProps) => <Component {...rest} {...props} />}
        />
      )
    }
    
    cogoToast.warn("You need an account to access this page.", {
      position: 'bottom-right',
      renderIcon: () => '👮🏻‍♀️',
      hideAfter: 3
    });
    return <Redirect to="/auth" />
  }

  return validateSession();
};

export default PrivateRoute;