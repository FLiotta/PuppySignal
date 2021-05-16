// @Packages
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import cogoToast from 'cogo-toast';
import { RouteComponentProps } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// @Project
import PetService from 'services/PetService';
import { Pet } from 'interfaces/pet';
import { ReactComponent as Logo } from 'assets/logo.svg';

// @Own
import './styles.scss';
import { BackendResponse } from 'interfaces/app';
import { fetchPetImage } from 'utils';

interface IMatch {
  petId: any
};

interface IProps extends RouteComponentProps<IMatch> {}

const Found: React.FC<IProps> = ({
  match,
  location,
}) => {
  const history = useHistory();
  const [pet, setPet] = useState<Pet | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  const fetchQR = (qr: string) => {
    setLoading(true);

    PetService.scanned(qr)
      .then((response: BackendResponse) => {
        setPet(response.data);
      })
      .catch(() => {
        cogoToast.warn('QR Invalid', { position: 'bottom-right' });
      })
      .then(() => setLoading(false));
  }

  useEffect(() => {
    const { qr } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { qr: string };

    if(qr) {
      fetchQR(qr);
    }
  }, []);

  useEffect(() => {
    if(pet) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;

          PetService.createPetLocation(pet.id, latitude, longitude);
        }
      )
    }
  }, [pet]);

  const handleManualSearch = (payload: any) => {
    const { qr } = payload;

    console.log(qr);
    if(qr) {
      console.log("aa")
      fetchQR(qr);
    }
  }

  const generateWspHyperlink = () => {
    const firstOwner = pet?.owners[0];

    const text = `Hello ${firstOwner?.first_name}! I got your number by scanning *${pet?.name}* PuppySignal code 🐶!`

    return `https://wa.me/${firstOwner?.phone_number}?text=${text}`
  }

  return (
    <div className="found">
      <div className="logo">
        <Logo className="logo-img" />
        <p className="logo-txt">PuppySignal</p>
      </div>
      <div className="found__header"></div>
      {!pet && (
        <div className="found__empty">
          <p>Have you find any code? Type it below and see to who it belongs.</p>
          <form onSubmit={handleSubmit(handleManualSearch)} className="w-100">
            <input
              className="found__empty-input"
              name="qr"
              placeholder="Example: QR_RJZYP5E"
              disabled={loading}
              ref={register({ 
                required: true,
                minLength: {
                  value: 10,
                  message: "QR Codes have more characters."
                },
                maxLength: {
                  value: 10,
                  message: "QR Codes have less characters."
                }
              })} />
            <button className="found__empty-btn" disabled={loading}>Search</button>
          </form>
          <a href="https://www.puppysignal.com" target="_blank" className="found__empty-disclaimer">
            <i>What's this?</i>
          </a>
        </div> 
      )}
      {pet && (
        <div className="found__body">
          <img src={fetchPetImage(pet?.profile_picture)} className="found__body-pfp" />
          <h1 className="found__body-name">{pet?.name}</h1>
          <p className="phrase">
            You have just scanned {pet?.name}, he may be lost.
            <br/><br/>
            A brief description let by his owner:
            <br/><br/>
            <q>{pet?.extra}</q>
            <br/><br/>
            His owner was notified with your current location! You can help <strong>{pet?.name}</strong> come back house.
            <br/><br/>
            <strong>How?:</strong> Get in contact with his owner with the button below!
          </p>
          <div className="ctas">
            {pet?.owners[0].phone_number && (
              <>
                <a href={generateWspHyperlink()} target="_blank">
                  <div className="wsp">
                    <i className="fab fa-whatsapp"></i> Whatsapp
                  </div>
                </a>
                <a href={`tel:${pet?.owners[0].phone_number}`} target="_blank"> 
                  <div className="call">
                    <i className="fas fa-phone-alt"></i> Call
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Found;