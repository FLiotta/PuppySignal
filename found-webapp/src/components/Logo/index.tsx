// @Packages
import cn from 'classnames';

// @Own
import './styles.scss';

interface IProps {
  breakLine?: boolean,
  className?: string,
  expand?: boolean,
  center?: boolean
  isotype?: boolean
  typo?: boolean
}

const Logo: React.FC<IProps> = ({
  breakLine,
  className,
  expand,
  center,
  isotype,
  typo
}) => {
  return (
    <div className={cn("logo", className, {
      "logo--expand": expand,
      "logo--center": center
    })}>
      {isotype && (
        <img className="logo__isotype" src="" />
      )}
      {typo && (
        <h1 className="logo__typo">
          Paws
          {breakLine && <br />}
          Tracer
        </h1>
      )}
    </div>
  );
}

export default Logo;