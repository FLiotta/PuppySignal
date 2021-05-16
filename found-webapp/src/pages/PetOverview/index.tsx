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

// @Own
import './styles.scss';
import PetLocation from 'components/PetLocations';

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
    <div className="petoverview-page">
      <div className="petoverview-page__section">
        {petId && 
          <div className="petoverview-page__petcard">
            <PetOverview petId={petId} />
          </div>
        }
        {pet != undefined && (
          <div className="petoverview-page__qr">
            <PetQR
              center
              className="petoverview-page__qr-code"
              id={`pet-${pet?.uuid}`}
              onClick={onQRDownload}
              petId={pet?.id}
              size={180}
            />
            <div className="petoverview-page__qr-explanation">
              <h4>QR Code</h4>
              <p>
                When people scans this QR, the location will be sent to you and displayed to the locations widget.
                <br/><br/>
                It allows the ones who scan the QR to interact in many ways with you.
                You should print int and put it in somewhere easy for people to locate it, like a collar.
              </p>
              <div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={onQRDownload}
                >               
                  💾 Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="petoverview-page__section">
        {pet?.id && (
          <div className="petoverview-page__locations">
            <PetLocation id={pet.id}/> 
          </div>
        )}
      </div>
    </div>
  );
}

export default PetOverviewPage;