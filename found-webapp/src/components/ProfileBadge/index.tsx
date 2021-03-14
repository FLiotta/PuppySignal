// @Packages
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// @Project
import { fetchUserImage } from 'utils';
import { selectSession } from 'selectors/session';

// @Own
import './styles.scss';

interface IProps { }

const ProfileBadge: React.FC<IProps> = (props) => {
  const session: any = useSelector(selectSession);

  return (
    <div className="profilebadge">
      <Link to="/me" style={{ textDecoration: 'none', color: 'unset' }}>
        <div className="profilebadge__header">
            <img src={fetchUserImage(session.profile_picture)} className="profilebadge__header-avatar" />
            <div className="profilebadge__header-info">
              <p className="profilebadge__header-info-name">
                {session.first_name} {session.last_name}
              </p>
            </div>
        </div>
      </Link>
    </div>
  );
};

export default ProfileBadge;