// @Packages
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// @Project
import { logout } from 'actions/session';

const Logout: React.FC<any> = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    setTimeout(() => {
      window.location.pathname = "/auth";
    }, 500);

  }, []);

  return (
    <div></div>
  );
}

export default Logout;