import React, { useEffect } from 'react';
// import Register from '../register/register';
import { showToast } from '../toast/toast';
import './home.scss';
import { useMutation, useReactiveVar } from '@apollo/client';
import { VERIFY_EMAIL } from '../../graphql/mutations';
import Spinner from '../spinner/spinner';
import { userAuthVar } from '../../common/cache';

function Home(props) {
    const { location, history } = props;
    const userAuth = useReactiveVar(userAuthVar);
    const [verifyEmail] = useMutation(VERIFY_EMAIL, {
        onCompleted(data) {
            const { status, message } = data.verifyEmail;
            if (status) {
                showToast({
                    message: 'Email verified successfully!',
                    variant: 'success',
                });
                history.push('/login');
            } else {
                showToast({ message, variant: 'error' });
            }
        },
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            verifyEmail({ variables: { token } });
            history.replace(location.pathname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // if (!userAuth) {
    //     return <Register {...props} />;
    // }
    return (
        <Spinner className="home" spinning={false}>
            {userAuth
                ? <h5>Hello {userAuth.displayName}!</h5>
                : <h5>Hello World!</h5>
            }
        </Spinner>
    );
}

export default Home;
