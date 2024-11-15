import React, { FC, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
// import { Loader } from 'rsuite';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const withNetwork = (Comp: React.ComponentType<any>) => {    
    const WithNetwork: FC = () => {        
        const navigate = useNavigate();
        const location = useLocation(); 
        const authState = useAppSelector((state) => state.authReducer);
        const dispatch = useAppDispatch();

        useEffect(() => {
            if (authState.isLoading) {
                return; 
            }

            if (!authState.isAuth && location.pathname !== '/register') {
                navigate('/sign-in'); 
            }
        }, [authState.isLoading, authState.isAuth, navigate, location.pathname]);

        // if (authState.isLoading) {
        //     return <Loader center content="Loading..." />;
        // }

        return <Comp authState={authState} dispatch={dispatch} />;
    };

    return WithNetwork;
};

export default withNetwork;
