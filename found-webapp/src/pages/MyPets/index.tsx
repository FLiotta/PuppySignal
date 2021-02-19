// @Project
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @Project
import AddPetModal from 'components/AddPetModal';
import PetsMagazine from 'components/PetsMagazine';

// @Own
import { fetchPets } from './actions';
import { selectPets } from './selectors';

interface IProps {};

const MyPets: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const pets = useSelector(selectPets);
  
  useEffect(() => {
    dispatch(fetchPets());
  }, []);
  
  return (
    <div className="mypets">
      <AddPetModal />
      <PetsMagazine pets={pets} />
    </div>
  );
}

export default MyPets;