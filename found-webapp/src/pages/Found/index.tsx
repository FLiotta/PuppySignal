// @Packages
import { useEffect, useState } from 'react';
import qs from 'qs';
import dayjs from 'dayjs';

// @Project
import logo from 'assets/logo.svg';
import { scanQR } from 'services/petservices';
import {IScanPetResponse} from 'interfaces/pet';

// @Own
import './styles.scss';

const FoundPage = () => {
    const [petFound, setPetFound] = useState<IScanPetResponse | null>(null)
    const [scanInputValue, setScanInputValue] = useState('');
    const [error, setError] = useState<String | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getLocation()
        const { qr } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { qr: string };
        
        if(qr) {
            handleSearchCode(qr);
        }
    }, [])

    const handleSearchCode = (code: string) => {
        if(code.length < 10) {
            return
        }

        setError(null);
        setLoading(true);

        scanQR(code)
            .then((response) => {
                const scannedPet = response.data;

                if(!scannedPet) {
                    throw new Error("Pet not returned from server")
                }
                
                setPetFound(scannedPet);
            })
            .catch(e  => {
                const errorDetail = e.response.data.detail;

                if(!errorDetail) {
                    setError("Unknown reason.")
                }
                
                setError(errorDetail);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(console.log);
        } else { 
            console.log(":(")
        }
    }

    return (
        <div className='wrapper'>
            <div className="foundpage">
                <img src={logo} width={50} height={50} className='foundpage-logo'/>
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
                            <img src="https://i.imgur.com/3Fi8UmQ.jpg" width={150} height={150}/>
                            <div className='foundpage-found__header-information'>
                                <h3 className='mt-0'>{petFound.pet.name} </h3>
                                <p>Specie: {petFound.pet.specie.name}</p>
                                <p>Race: {petFound.pet.breed?.name || 'Unknown' }</p>
                                <p>Lost since: {
                                    petFound.pet?.lost_since 
                                        ? dayjs(petFound.pet.lost_since).format("DD/MM/YYYY")
                                        : "Unknown"
                                    }
                                </p>
                                <p>Color: {petFound.pet?.color || 'Unknown' }</p>
                            </div>    
                        </div>
                        <p className='foundpage-found__description'><small>{petFound.pet.extra}</small></p>
                        <hr/>
                        {petFound.owners.map(owner => (
                            <div className='foundpage-found__contact'>
                                <p>Owner: {owner.first_name} {owner.last_name}</p>
                                <ul>
                                    <li>{owner.phone_number}</li>
                                    <li>{owner.email}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoundPage;