// @Packages
import { NavLink } from 'react-router-dom';
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
      <NavLink
        to="/"
        exact
        activeClassName="sidebarmenu__option--active"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-home mr-2"></i> Home sweet home
          </small>
        </div>
      </NavLink>
      <hr />
      <NavLink 
        to="/notifications"
        activeClassName="sidebarmenu__option--active"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-bell mr-2"></i> Notifications
          </small>
        </div>
      </NavLink>
      <hr />
      <NavLink
        to="/my-pets"
        activeClassName="sidebarmenu__option--active"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-paw mr-2"></i> My pets
          </small>
        </div>
      </NavLink>
      <hr />
      <NavLink 
        to="/settings"
        activeClassName="sidebarmenu__option--active"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
          <i className="fas fa-cog mr-2"></i> Settings
          </small>
        </div>
      </NavLink>
      <hr />
      <NavLink 
        to="/logout"
        activeClassName="sidebarmenu__option--active"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <div className="sidebarmenu__option">
          <small className="sidebarmenu__option-description">
            <i className="fas fa-sign-out-alt mr-2"></i> Disconnect
          </small>
        </div>
      </NavLink>
    </div>
  );
}

export default SidebarMenu;