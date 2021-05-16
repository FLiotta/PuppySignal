// @Packages
import {  useState, useEffect } from 'react';

// @Project
import PetService from 'services/PetService';
import { BackendResponse } from 'interfaces/app';
import { Pet } from 'interfaces/pet';
import { fetchPetImage } from 'utils';

// @Own
import './styles.scss';
import Loading from 'components/Loading';

interface IProps {
  petId?: number,
  populateOwner?: boolean
};

const PetOverview: React.FC<IProps> = ({
  petId,
  populateOwner
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [owner, setOwner] = useState<any | undefined>(undefined);

  useEffect(() => {
    PetService.getPetById(petId, { populateOwner })
      .then((response: BackendResponse) => {
        response.data.pet.profile_picture = fetchPetImage(response.data.pet.profile_picture);
        
        setPet(response.data.pet);
        setOwner(response.data.owner);
      })
      .catch(console.log)
      .then(() => setLoading(false));
  }, []);
  return (
    <div className="petoverview">
      <Loading visible={loading}/>
      <img
        src={pet?.profile_picture}
        className="petoverview__photo"
      />
      <div className="petoverview__description">
        <h4>{pet?.name}</h4>
        <small>7 años</small>
        <small>Dorado</small>
        <small>Argentinian dogo</small>
        <small>{pet?.extra}</small>
      </div>
    </div>
  )
};

export default PetOverview;