// @Packages
import { Link } from 'react-router-dom';
import cn from 'classnames';

// @Own
import './styles.scss';

interface IProps {
  className?: string
};

const SidebarMenu: React.FC<IProps> = ({
  className
}) => {
  return (
    <div className={cn("sidebarmenu", className)}>
      <Link to="/home" style={{ textDecoration: 'none', color: 'unset' }}>
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-home mr-2"></i> Home sweet home
          </small>
        </div>
      </Link>
      <hr />
      <Link to="/notifications" style={{ textDecoration: 'none', color: 'unset' }}>
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-bell mr-2"></i> Notifications
          </small>
        </div>
      </Link>
      <hr />
      <Link to="/my-pets" style={{ textDecoration: 'none', color: 'unset' }}>
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-paw mr-2"></i> My pets
          </small>
        </div>
      </Link>
      <hr />
      <Link to="/settings" style={{ textDecoration: 'none', color: 'unset' }}>
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
          <i className="fas fa-cog mr-2"></i> Settings
          </small>
        </div>
      </Link>
      <hr />
      <Link to="/logout" style={{ textDecoration: 'none', color: 'unset' }}>
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-sign-out-alt mr-2"></i> Disconnect
          </small>
        </div>
      </Link>
    </div>
  );
}

export default SidebarMenu;