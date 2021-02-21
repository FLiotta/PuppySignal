// @Packages
import cn from 'classnames';

// @Own
import './styles.scss';

interface IProps {
  children: React.ReactNode,
  className?: string
};

const Section: React.FC<IProps> = ({children, className}) => {
  return (
    <div className={cn("section", className)}>
      {children}
    </div>
  );
}

export default Section;