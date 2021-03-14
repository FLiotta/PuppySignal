// @Packages
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';

// @Project
import { getSpecieById } from 'selectors/species';
import { Pet } from "interfaces/pet";
import { fetchPetImage } from 'utils';

// @Own
import './styles.scss';
import { Specie } from 'interfaces/app';

interface IProps extends Pet {
  className?: string;
};

const PetCard: React.FC<IProps> = ({
  id,
  name,
  specie_id,
  profile_picture,
  className,
}) => {
  const photo = fetchPetImage(profile_picture || '');
  const specie: Specie = useSelector(state => getSpecieById(state, specie_id));

  return (
    <Link to={`/my-pets/${id}`} style={{textDecoration: 'none', color: 'unset'}}>
      <div className={cn('petcard', className)}>
        <div className="petcard__header">
          <img src={photo} className="petcard__photo" />
        </div>
        <div className="petcard__body">
          <h6 className="petcard__name">{name}</h6>
          <small className="petcard__attribute"><i className="fas fa-paw"></i> {specie?.name}</small>
          <small className="petcard__attribute"><i className="fas fa-tint"></i> Black</small>
          <small className="petcard__attribute"><i className="fas fa-birthday-cake"></i> 3 Years old</small>
        </div>
      </div>
    </Link>
  );
}

export default PetCard;