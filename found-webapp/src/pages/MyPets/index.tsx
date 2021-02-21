// @Project
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @Project
import AddPetModal from 'components/AddPetModal';
import PetsMagazine from 'components/PetsMagazine';

// @Own
import { fetchPets, addNewPet } from './actions';
import { selectPets } from './selectors';
import cogoToast from 'cogo-toast';
import { Pet } from 'interfaces/pet';

interface IProps {};

const MyPets: React.FC<IProps> = (props) => {
  const [petModalVisible, setPetModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const pets = useSelector(selectPets);
  
  useEffect(() => {
    dispatch(fetchPets());
  }, []);
  
  const onPetAddSuccess = (newPet: Pet) => {
    setPetModalVisible(false);
    dispatch(addNewPet(newPet));

    cogoToast.success(`Welcome abroad ${newPet.name}`, {
      position: 'bottom-right',
    });
  }

  const onFailure = () => {
    cogoToast.error("Something happened, we couldn't add your pet", {
      position: 'bottom-right'
    });
  };

  return (
    <div className="mypets">
      <button
        className="btn btn-primary btn-sm mb-3" 
        onClick={() => setPetModalVisible(true)}
      >
        Add a new pet
      </button>
      <AddPetModal
        onSuccess={onPetAddSuccess}
        onFailure={onFailure}
        visible={petModalVisible}
        onCloseRequest={() => setPetModalVisible(false)}
      />
      <PetsMagazine pets={pets} />
    </div>
  );
}

export default MyPets;