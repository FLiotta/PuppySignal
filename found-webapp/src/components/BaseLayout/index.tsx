// @Project
import ProfileBadge from '../ProfileBadge';
import SidebarMenu from '../SidebarMenu';

// @Own
import './styles.scss';

interface IProps { 
  children: React.ReactNode
}; 

const BaseLayout: React.FC<IProps> = ({
  children
}) => {
  return (
    <div className="baselayout">
      <div className="baselayout__side">
        <ProfileBadge />
        <SidebarMenu className="mt-3" />
      </div>
      <div className="baselayout__body">
        { children }
      </div>
    </div>
  );
};

export default BaseLayout;