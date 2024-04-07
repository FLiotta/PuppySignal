// @Packages
import { useEffect, useState } from 'react';
import qs from 'qs';
import cn from 'classnames';
import dayjs from 'dayjs';

// @Project
import logo from 'assets/logo.svg';
import { scanQR, shareLocation } from 'services/petservices';
import { IScanPetResponse } from 'interfaces/pet';

// @Own
import './styles.scss';

const FoundPage = () => {
    const [petFound, setPetFound] = useState<IScanPetResponse | null>(null)
    const [scanInputValue, setScanInputValue] = useState('');
    const [error, setError] = useState<String | null>(null);
    const [loading, setLoading] = useState(false);

    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [locationModalLoading, setLocationModalLoading] = useState(false);
    const [locationModalSuccess, setLocationModalSuccess] = useState(false);

    useEffect(() => {
        const { qr } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { qr: string };

        if (qr) {
            handleSearchCode(qr);
        }
    }, [])

    const handleSearchCode = (code: string) => {
        if (code.length < 10) {
            return
        }

        setError(null);
        setLoading(true);

        scanQR(code)
            .then((response) => {
                const scannedPet = response.data;

                if (!scannedPet) {
                    throw new Error("Pet not returned from server")
                }

                setLocationModalVisible(true);
                setPetFound(scannedPet);
            })
            .catch(e => {
                const errorDetail = e.response.data.detail;

                if (!errorDetail) {
                    setError("Unknown reason.")
                }

                setError(errorDetail);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleCloseLocationModal = () => {
        setLocationModalVisible(false)
    }

    const handleShareLocation = () => {
        if (!petFound) {
            return
        }

        setLocationModalLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                geolocationPosition => {
                    shareLocation(petFound?.code, geolocationPosition.coords.latitude, geolocationPosition.coords.longitude)
                        .then(() => {
                            setLocationModalLoading(false)
                            setLocationModalVisible(false)
                            setLocationModalSuccess(true)
                        })
                        .catch(() => setLocationModalLoading(false))
                },
                () => {
                    setLocationModalLoading(false);
                }
            );
        }
    }

    return (
        <div className='wrapper'>
            <div className="foundpage">
                <div
                    className={
                        cn('foundpage-toast', {
                            'foundpage-toast--visible': locationModalVisible,
                            'foundpage-toast--hidden': !locationModalVisible
                        })
                    }
                >
                    <p>🧭 Would you like to send the pet's location to its owners?</p>
                    <p><small>They will be notified and able to see it on the map</small></p>
                    <div className='foundpage-toast__buttons'>
                        <button 
                            className='btn-alt' 
                            onClick={handleCloseLocationModal} 
                            disabled={locationModalLoading}
                        >
                            Close
                        </button>
                        <button 
                            className='btn ml-2' 
                            onClick={handleShareLocation} 
                            disabled={locationModalLoading}
                        >
                            {locationModalLoading ? "Sharing location..." : "Share location"}
                        </button>
                    </div>
                </div>
                <img src={logo} width={50} height={50} className='foundpage-logo' />
                {!petFound
                    ? (
                        <div className='foundpage-search'>
                            <p className='foundpage-search__description'>Did you just found some code out there in the wild?</p>
                            <input
                                type="text"
                                id="found-code-input"
                                name="found-code-input"
                                required
                                maxLength={10}
                                minLength={10}
                                onChange={e => setScanInputValue(e.target.value)}
                                disabled={loading}
                            />
                            <div className='foundpage-search__footer'>
                                <small className='foundpage-search__error'>{error}</small>
                                <button className='foundpage-search__lookupbtn' onClick={() => handleSearchCode(scanInputValue)} disabled={loading}>Look up</button>
                            </div>
                        </div>
                    ) : (
                        <div className='foundpage-found'>
                            <div className='foundpage-found__header'>
                                <img src={petFound.pet.profile_picture} width={150} height={150} />
                                <div className='foundpage-found__header-information'>
                                    <h3 className='mt-0'>{petFound.pet.name} </h3>
                                    <p>Specie: {petFound.pet.specie.name}</p>
                                    <p>Breed: {petFound.pet.breed?.name || 'Unknown'}</p>
                                    <p>Lost since: {
                                        petFound.pet?.lost_since
                                            ? dayjs(petFound.pet.lost_since).format("DD/MM/YYYY")
                                            : "Unknown"
                                    }
                                    </p>
                                </div>
                            </div>
                            <p className='foundpage-found__description'><small>{petFound.pet.extra}</small></p>
                            <hr />
                            {petFound.owners.map(owner => (
                                <div className='foundpage-found__contact'>
                                    <p>Owner: {owner.first_name} {owner.last_name}</p>
                                    <ul>
                                        <li>{owner.phone_number}</li>
                                        <li>{owner.email}</li>
                                    </ul>
                                </div>
                            ))}

                            {locationModalSuccess && (
                                <p className='congratulations-text'>
                                    <small>🍀 Congratulations! You shared the pet's location with its owners. 🍀</small>
                                </p>
                            )}
                        </div>
                    )}
            </div>
        </div>
    )
}

export default FoundPage;