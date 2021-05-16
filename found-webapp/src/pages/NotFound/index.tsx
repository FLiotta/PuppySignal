// @Packages
import { useHistory } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import { useEffect } from 'react';

const NotFound: React.FC<any> = () => {
  const history = useHistory();

  useEffect(() => {
    cogoToast.info("The page you're looking for may be deleted", { position: 'bottom-right' });
    
    history.push('/found');
  })

  return (
    <div></div>
  );
}

export default NotFound;