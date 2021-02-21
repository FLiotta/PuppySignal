// @Packages
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

// @Project
import PetService from 'services/PetService';
import Section from 'components/Section';
import PetOverview from 'components/PetOverview';
import PetQR from 'components/PetQR';
import { BackendResponse } from 'interfaces/app';
import { Pet } from 'interfaces/pet';
import { downloadCanvasAsImage, fetchPetImage } from 'utils';

interface IMatch {
  id: any
};

interface IProps extends RouteComponentProps<IMatch> {};

const PetOverviewPage: React.FC<IProps> = ({
  match  
}) => {
  const [loading, setLoading]  = useState<boolean>();
  const [petId, setPetId] = useState<number | undefined>(undefined);
  const [pet, setPet] = useState<Pet>();

  const onQRDownload = () => {
    downloadCanvasAsImage(`#pet-${pet?.uuid}`, `${pet?.name} QR`);
  };

  useEffect(() => {
    const { id } = match.params;
    
    setPetId(id);
    PetService.getPetById(petId, { populateOwner: false })
      .then((response: BackendResponse) => {
        setPet(response.data.pet);
      })
      .catch(console.log)
      .then(() => setLoading(false));
  })
  return (
    <div className="petoverview">
      {petId && <PetOverview petId={petId} />}
      <Section className="mt-4">
        {pet != undefined && (
          <PetQR
            id={`pet-${pet?.uuid}`}
            onClick={onQRDownload}
            petId={pet?.id}
            petToken={pet?.token}
            size={210}
          />
        )}
        <div className="ms-3">
          <h4>QR Code</h4>
          <p>
            This QR code will allow others to identify your pet and contact you in case of a lost.
            <br />
            Print it and put it somewhere people could easly find it, like a collar.
            <br /><br />
            <small>It would be great if you can put some protection to the QR.</small>
          </p>
          <div>
            <button
              className="btn btn-primary btn-sm"
              onClick={onQRDownload}
            >
              Download
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default PetOverviewPage;