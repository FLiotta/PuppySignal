// @Packages
import {  useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

// @Project
import PetService from '../../services/PetService';
import { BackendResponse } from '../../interfaces/app';
import { Pet } from '../../interfaces/pet';

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
    return JSON.stringify({owner, pet}, undefined, 3);
  }
  
  return (
    <div>
      <pre>
        {JSON.stringify({owner, pet}, undefined, 3)}
      </pre>
      <QRCode value={formatQR()} />
    </div>
  )
};

export default PetOverview;