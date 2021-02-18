// @Packages
import {  useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

// @Project
import PetService from '../../services/PetService';
import { BackendResponse } from '../../interfaces/app';
import { Pet } from '../../interfaces/pet';
import { fetchPetImage } from '../../utils';

interface IProps {
  petId?: number,
  populateOwner?: boolean
};

const PetOverview: React.FC<IProps> = ({
  petId,
  populateOwner
}) => {
  const [pet, setPet] = useState<Pet | undefined>(undefined);
  const [owner, setOwner] = useState<any | undefined>(undefined);

  useEffect(() => {
    PetService.getPetById(petId, { populateOwner })
      .then((response: BackendResponse) => {
        setPet(response.data.pet);
        setOwner(response.data.owner);
      })
      .catch(console.log);
  }, []);

  const formatQR = (): string => {
    return "http://192.168.0.249:3000/found/" + pet?.id;
  }
  
  return (
    <div>
      <img src={fetchPetImage(pet?.profile_picture)} className="mx-auto d-block w-25" />
      <pre>
        {JSON.stringify({owner, pet}, undefined, 3)}
      </pre>
      <QRCode value={formatQR()} />
    </div>
  )
};

export default PetOverview;