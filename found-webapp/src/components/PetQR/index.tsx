// @Packages
import QRCode from 'qrcode.react';
import cn from 'classnames';

// @Project
import DogFace from 'assets/dogface.png';
import { FOUND_QR_PATH } from 'config';

// @Own
import './styles.scss';

interface IProps {
  petId: number,
  petToken: string,
  id: string,
  size?: number,
  className?: string,
  onClick(): void,
};

const PetQR: React.FC<IProps> = ({
  petId,
  petToken,
  size,
  id,
  className,
  onClick,
  ...rest
}) => {
  const path = `${FOUND_QR_PATH}/${petId}?t=${petToken}`;
  console.log(path)
  return (
    <QRCode
      id={id}
      className={cn('petqrcode')}
      size={size}
      value={path}
      onClick={onClick}
      imageSettings={{
        src: DogFace,
        width: 50,
        height: 50,
      }}
      {...rest}
    />
  )
}

export default PetQR;
