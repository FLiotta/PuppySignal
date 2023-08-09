// @Packages
import { useEffect, useState } from 'react';
import qs from 'qs';

// @Project
import logo from 'assets/logo.svg';
import { scanQR } from 'services/petservices';
import {IPet} from 'interfaces/pet';

// @Own
import './styles.scss';

const FoundPage = () => {
    const [petFound, setPetFound] = useState<IPet | null>(null)
    const [scanInputValue, setScanInputValue] = useState('');
    const [error, setError] = useState<String | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { qr } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { qr: string };
        
        if(qr) {
            handleSearchCode(qr);
        }
    }, [])

    const handleSearchCode = (code: string) => {
        if(code.length < 6) {
            return
        }

        setError(null);
        setLoading(true);

        scanQR(code)
            .then((response) => {
                const scannedPet = response.data.data;

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

    const capitalizeFirstLetter = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
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
                            maxLength={6}
                            minLength={6}
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
                                <h3 className='mt-0'>{capitalizeFirstLetter(petFound.name)} </h3>
                                <p>Specie: Dog</p>
                                <p>Race: Dachshund</p>
                                <p>Lost since: 18/02/2023</p>
                                <p>Color: Gray</p>
                            </div>    
                        </div>
                        <p className='foundpage-found__description'><small>{petFound.extra}</small></p>
                        <hr/>
                        <div className='foundpage-found__contact'>
                            <p>Owner: Blanca P.</p>
                            <p>Contact Information: +54 9 341 1001 0110</p> 
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoundPage;