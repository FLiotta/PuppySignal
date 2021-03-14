// @Packages
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import cogoToast from 'cogo-toast';

// @Project
import { signIn } from 'actions/session';
import Loading from 'components/Loading';
import Logo from 'components/Logo';

// @Own
import './styles.scss';

interface FormFields {
  email: string,
  password: string
};

interface IPropsForm {
  onSubmit(payload: FormFields): any
};

const Form: React.FC<IPropsForm> = ({ onSubmit }) => {
  const { handleSubmit, register } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group mt-5">
        <label htmlFor="email"><small>Email</small></label>
        <input 
          className="form-control form-control-sm" 
          placeholder="e.g.: test@gmail.com" 
          type="email" 
          name="email"
          ref={register({ required: true })}
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="password"><small>Password</small></label>
        <input
          className="form-control form-control-sm"
          placeholder="*******"
          type="password"
          name="password"
          ref={register({ required: true })}
        />
      </div>
      <div className="form-group mt-3 justify-content-end d-flex">
        <button className="btn btn-sm btn-primary">Log In</button>
      </div>
    </form>
  )
};

interface IProps { };
const Auth: React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = ({ email, password }: FormFields) => {
    setLoading(true);

    dispatch(signIn(email, password))
      .then((user: any) => {
        cogoToast.success(`Hey ${user.first_name}! Nice to see you back!`, {
          position: 'bottom-right',
          renderIcon: () => '🐶',
          hideAfter: 3,          
        });
        history.push('/');
      })
      .catch((error: any) => {
        cogoToast.warn('Whoops, it seems user is invalid.', { position: 'bottom-right' });
      })
      .then(() => setLoading(false));
  };

  return (
    <div className="auth">
      <div className="auth__dialog">
        <Logo breakLine center typo />
        <Loading visible={loading} />
        <Form onSubmit={onSubmit} />
      </div>
      <div className="auth__body">
        <h1 className="auth__body-title">Did you know you can track many pets per account?</h1>
        <p className="auth__body-message">With Pet Tracer you can track as many pets as you want, and its totally free!</p>
      </div>
    </div>
  );
}

export default Auth;