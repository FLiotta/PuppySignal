// @Packages
import { Link } from 'react-router-dom';
import cn from 'classnames';

// @Project
import { Pet } from "../../interfaces/pet";
import Dog from '../../assets/dog.png';
import Cat from '../../assets/cat.png';

// @Own
import './styles.scss';

interface IProps extends Pet {
  className?: string;
};

const PetCard: React.FC<IProps> = ({
  id,
  name,
  specie_id,
  className,
}) => {
  return (
    <Link to={`/my-pets/${id}`} style={{textDecoration: 'none', color: 'unset'}}>
      <div className={cn('petcard', className)}>
        <h6 className="petcard__name">{name} (#{id})</h6>
        <p>Especie {specie_id}</p>
        <img src={specie_id === 1 ? Dog : Cat} className="d-block mx-auto petcard__identifier" />
      </div>
    </Link>
  );
}

export default PetCard;