// @Packages
import { useSelector } from 'react-redux';

// @Project
import { selectSession } from '../../selectors/session';
import TestAvatar from '../../assets/avatar.png';

// @Own
import './styles.scss';

interface IProps { }

const ProfileBadge: React.FC<IProps> = (props) => {
  const session: any = useSelector(selectSession);
  return (
    <div className="profilebadge">
      <div className="profilebadge__header">
          <img src={TestAvatar} className="profilebadge__header-avatar" />
          <div className="profilebadge__header-info">
            <h5 className="profilebadge__header-info-name">
              {session.first_name} {session.last_name}
            </h5>
            <p className="profilebadge__header-info-description">
              <small>Rosario - Argentina</small>
            </p>
          </div>
      </div>
      <hr />
      <small>6 Mascotas</small>
      <small>9 Días de conexion</small> 
    </div>
  );
};

export default ProfileBadge;