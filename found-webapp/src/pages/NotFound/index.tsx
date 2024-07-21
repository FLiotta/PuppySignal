import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const NotFoundPage = () => {
    const [tears, setTears] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const tearsInterval = setInterval(() => {
            setTears(_tears => {
                if (_tears < 3) {
                    return _tears + 1
                }

                return 0;
            });
        }, 500);

        return () => {
            clearInterval(tearsInterval);
        }
    }, []);

    const handleRedirect = () => navigate('/');

    return (
        <div className='notfoundpage'>
            <h1 className='notfoundpage-sadface'>
                :
                {Array(tears).fill("'").join("")}
                (
            </h1>
            <h1>404 Page not found</h1>
            <p>Seems like the page you are trying to reach doesn't exist or was moved</p>
            <small>Maybe you meant the <strong onClick={handleRedirect} className='notfoundpage-redirect'>Found page</strong>?</small>
        </div>
    )
}

export default NotFoundPage;
