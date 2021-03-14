// @Project
import ProfileBadge from 'components/ProfileBadge';
import SidebarMenu from 'components/SidebarMenu';
import Logo from 'components/Logo';

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
        <Logo center typo breakLine className="baselayout__logo" />
      </div>
      <div className="baselayout__body">
        { children }
      </div>
    </div>
  );
};

export default BaseLayout;