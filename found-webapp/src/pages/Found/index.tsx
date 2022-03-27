// @Packages
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import cn from 'classnames'
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

interface IMatch {
  petId: any
};

interface IProps extends RouteComponentProps<IMatch> {}

const Found: React.FC<IProps> = ({
  match,
  location,
}) => {
  const history = useHistory();
  const [qrCode, setQrCode] = useState<string | undefined>();
  const [pet, setPet] = useState<Pet | undefined>();
  const [locationShared, setLocationShared] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  const fetchPetDataByCode = (code: string) => {
    PetService.scanned(code)
      .then((response: BackendResponse) => {
        cogoToast.success(`You found ${response.data.name}!`, { 
          position: 'bottom-center',
          renderIcon: () => '🔎'
        });
        setQrCode(code)
        setPet(response.data);
      })
      .catch(() => {
        cogoToast.warn('QR Invalid', { position: 'bottom-center' });
      })
      .then(() => setLoading(false));
  }

  useEffect(() => {
    const { qr } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { qr: string };

    if(qr) {
      fetchPetDataByCode(qr)
    }
  }, []);

  const handleManualSearch = (payload: any) => {
    const { qr } = payload;

    if(qr) {
      fetchPetDataByCode(qr)
    }
  }

  const handleShareLocation = () => {
    if(!pet || !qrCode || locationShared) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;

        PetService.createPetLocation(pet.id, qrCode, latitude, longitude)
          .then(() => {
            setLocationShared(true);
            cogoToast.success(`Location shared with ${pet.name}'s owner!`, {
              position: 'bottom-center',
              renderIcon: () => '🎉'
            })
          })
      }
    )
  }

  const popLocationAlert = (e: any) => {
    e.preventDefault();

    const message = `Your current latitude and longitude will be shared with the owner, along with the current datetime and qr code.`
    
    alert(message);
  }

  const generateWspHyperlink = () => {
    /*const firstOwner = pet?.owners[0];

    const text = `Hello ! I got your number by scanning *${pet?.name}* PuppySignal code 🐶!`

    return `https://wa.me/${firstOwner?.phone_number}?text=${text}`*/
    return ""
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
                  value: 2,
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
          <img src={pet?.profile_picture} className="found__body-pfp" />
          <h1 className="found__body-name">{pet?.name}</h1>
          <p>
            You have just scanned <strong>{pet?.name}</strong>, He may be lost.
          </p>
          <p>
            A brief description let by his owner:
          </p>
          <q>
            <i>{pet?.extra}</i>
          </q>
          <hr style={{width: 100}}/>
          <p>
            You can help <strong>{pet?.name}</strong> come back house. Share your current location with his owner.
          </p>
          <div className="ctas">
            <div 
              className={cn("location", {
                "location--disabled": locationShared
              })}
              onClick={handleShareLocation}
            >
              <i className="fa fa-location-arrow"></i> Send my current location!
            </div>
            <a href="!#" onClick={popLocationAlert}><i>What data is sent to the owner?</i></a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Found;