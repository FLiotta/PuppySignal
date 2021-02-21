// @Packages
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import { RouteComponentProps } from 'react-router-dom';

// @Project
import PetService from 'services/PetService';
import { Pet } from 'interfaces/pet';

// @Own
import './styles.scss';
import { BackendResponse } from 'interfaces/app';
import { fetchPetImage } from 'utils';

interface IMatch {
  petId: any
};

interface IProps extends RouteComponentProps<IMatch> {}

const Found: React.FC<IProps> = ({
  match
}) => {
  const history = useHistory();
  const [pet, setPet] = useState<Pet | undefined>();

  useEffect(() => {
    const { petId } = match.params;

    if(!petId) {
      cogoToast.warn('Page unavailable', { position: 'bottom-right' });
      
      history.push('/');
    }

    PetService.scanned(petId)
      .then((response: BackendResponse) => {
        cogoToast.error("TODO: Implement privacy, only people who scanned should be available to see!", { position: 'bottom-right' });
        setPet(response.data);
      })
      .catch(() => {
        cogoToast.warn('Page unavailable', { position: 'bottom-right' });
        history.push('/');
      });
  }, []);

  return (
    <div className="found">
      <h1 className="text-center">🐶</h1>
      <h3 className="text-center">Hmm, what do we have here?</h3>
      <img src={fetchPetImage(pet?.profile_picture)} className="found__photo" />
      <pre className="found__debug">{JSON.stringify(pet, undefined, 3)}</pre>
      <div className="d-flex flex-column">
        <button className="btn btn-sm btn-primary">Notify owner</button>
        <button className="btn btn-sm btn-primary my-2">Chat with the owner</button>
        <button className="btn btn-sm btn-danger">Send alert of lost dog in the zone!</button>
      </div>
    </div>
  );
}

export default Found;