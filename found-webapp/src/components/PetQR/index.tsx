// @Packages
import QRCode from 'qrcode.react';
import cn from 'classnames';

// @Project
import { FOUND_QR_PATH } from 'config';

// @Own
import './styles.scss';

interface IProps {
  petId: number,
  id: string,
  size?: number,
  className?: string,
  onClick(): void,
  center?: boolean
};

const PetQR: React.FC<IProps> = ({
  petId,
  size,
  id,
  className,
  center,
  onClick,
  ...rest
}) => {
  const path = `${FOUND_QR_PATH}?i=${petId}`;
  
  return (
    <QRCode
      id={id}
      className={cn('petqrcode', {
        'petqrcode--center': center
      })}
      size={size}
      value={path}
      onClick={onClick}
      {...rest}
    />
  )
}

export default PetQR;
