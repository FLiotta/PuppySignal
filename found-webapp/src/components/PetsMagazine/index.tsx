// @Project
import { Pet } from '../../interfaces/pet';
import PetCard from '../PetCard';

// @Own
import MockedData from './mockedData';
import './styles.scss';

interface IProps {
  pets: Pet[]
};

const PetsMagazine: React.FC<IProps> = ({
  pets,
}) => {
  return (
    <div className="petsmagazine">
      {pets.map((pet: Pet) => (
        <PetCard
          {...pet} 
          key={'petsmagazine_' + pet.id}
          className="me-5 mb-5"
        />
      ))}
    </div>
  );
}

export default PetsMagazine;