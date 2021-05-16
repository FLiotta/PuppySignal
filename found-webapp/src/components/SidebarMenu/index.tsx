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
      {/**
       * <NavLink
        to="/"
        exact
        activeClassName="sidebarmenu__option--active"
        className="sidebarmenu__option"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <small className="sidebarmenu__option-description">
          <i className="fas fa-home mr-2"></i> Home sweet home
        </small>
      </NavLink>
       
      <NavLink 
        to="/notifications"
        activeClassName="sidebarmenu__option--active"
        className="sidebarmenu__option"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <small className="sidebarmenu__option-description">
          <i className="fas fa-bell mr-2"></i> Notifications
        </small>
      </NavLink>
      */}
      <NavLink
        to="/my-pets"
        activeClassName="sidebarmenu__option--active"
        className="sidebarmenu__option"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <small className="sidebarmenu__option-description">
          <i className="fas fa-paw mr-2"></i> My pets
        </small>
      </NavLink>
      {/**
       * <NavLink  
        to="/settings"
        activeClassName="sidebarmenu__option--active"
        className="sidebarmenu__option"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <small className="sidebarmenu__option-description">
          <i className="fas fa-cog mr-2"></i> Settings
        </small>
      </NavLink>
       */}
      <NavLink 
        to="/logout"
        activeClassName="sidebarmenu__option--active"
        className="sidebarmenu__option"
        style={{ textDecoration: 'none', color: 'unset' }}
      >
        <small className="sidebarmenu__option-description">
          <i className="fas fa-sign-out-alt mr-2"></i> Disconnect
        </small>
      </NavLink>
    </div>
  );
}

export default SidebarMenu;