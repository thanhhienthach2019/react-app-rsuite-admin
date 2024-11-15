import React, { FC, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { IAuthDto } from '../../../interfaces/dto/IAuthDto'
import { ITwoFactorLogin } from '../../../interfaces/dto/ITwoFactorLoginDto'
import { Form, Button, Panel, IconButton, Stack, Divider, Loader } from 'rsuite';
import { Link } from 'react-router-dom';
import GithubIcon from '@rsuite/icons/legacy/Github';
import FacebookIcon from '@rsuite/icons/legacy/Facebook';
import GoogleIcon from '@rsuite/icons/legacy/Google';
import WechatIcon from '@rsuite/icons/legacy/Wechat';
import { WithNetworkProps } from '../../../interfaces/WithNetworkProps'
import withNetwork from '../../../hocs/withNetwork'
import { signIn } from '../../../store/action-creators/AuthActionCreators'
import { twoFactorLog } from '../../../store/action-creators/AuthActionCreators'
import { ToastUtils } from '../../../utils/ToastUtils';
import { authActions } from '../../../store/reducers/AuthReducer';
import Brand from '@/components/Brand';

const SignUp: FC<WithNetworkProps> = ({ authState, dispatch }: WithNetworkProps) => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [message, setMessage] = useState({ content: '', type: '' });
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [expiryTime, setExpiryTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const remainingTimeRef = useRef(remainingTime);
    const requiresTwoFactorRef = useRef(requiresTwoFactor);

    // Effect for setting remaining time based on expiry time
    useEffect(() => {
        if (requiresTwoFactor && expiryTime > 0) {
            setRemainingTime(expiryTime * 60); 
            requiresTwoFactorRef.current = true; 
        }
    }, [requiresTwoFactor, expiryTime]);

    // Effect for keeping track of remaining time
    useEffect(() => {
        remainingTimeRef.current = remainingTime; // Keep track of remaining time
    }, [remainingTime]);

    // Effect for handling countdown timer
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined; 
        if (requiresTwoFactorRef.current) {
            if (remainingTimeRef.current > 0) {
                interval = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        if (prevTime <= 1) {
                            ToastUtils.error('Authentication time has expired. Please log in again');                            
                            setRequiresTwoFactor(false); 
                            return 0; 
                        }
                        return prevTime - 1; 
                    });
                }, 1000);
            }

            return () => {
                clearInterval(interval); 
            };
        }
    }, [requiresTwoFactor]); 

    const handleTwoFactorLogin = async () => {
        try {
            const twofactor: ITwoFactorLogin = {
                Email: email,
                TwoFactorCode: twoFactorCode,
            };
            dispatch(authActions.refreshPending());
            const resulTwoFactorAction = await dispatch(twoFactorLog({ twofactor }));
            const { tokensData } = resulTwoFactorAction.payload;
            if (twoFactorLog.fulfilled.match(resulTwoFactorAction)) {
                ToastUtils.success('Authentication successful');                
                localStorage.setItem('_ACT_AUT', tokensData.accessJwt)
                setTimeout(() => {
                    navigate('/');
                }, 1000);                
            } else {                
                ToastUtils.error('Verification failed');
                dispatch(authActions.refreshRejected());                
            }
        } catch (error) {            
            ToastUtils.error('Error during verification');
            dispatch(authActions.refreshRejected());            
        } finally {
            dispatch(authActions.refreshRejected());
        }
    };
    const handleSignIn = async () => {
        try {
            const authDto: IAuthDto = {
                Email: email,
                Password: password,
            };

            dispatch(authActions.refreshPending());
            const resultAction = await dispatch(signIn({ authDto }));
            if (signIn.fulfilled.match(resultAction)) {
                const { expiryTime, requiresTwoFactor, tokensData } = resultAction.payload;
                if (requiresTwoFactor) {
                    setRequiresTwoFactor(true);
                    setRemainingTime(1);
                    setExpiryTime(expiryTime);
                } else {
                    ToastUtils.success('Login success');                    
                    localStorage.setItem('_ACT_AUT', tokensData.accessJwt)
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);                    
                }

            } else {                
                ToastUtils.error('Login failed');
                dispatch(authActions.refreshRejected());                
            }
        } catch (error) {            
            ToastUtils.error('Error during login');
            dispatch(authActions.refreshRejected());            
        } finally {
            dispatch(authActions.refreshRejected());
        }
    };

    useEffect(() => {
        if (authState.isAuth) {
            navigate('/')
        }
    }, [navigate, authState.isAuth])
    // Convert seconds to minutes and seconds for display
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;


    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            direction="column"
            style={{
                height: '100vh'
            }}
        >
            <Brand style={{ marginBottom: 10 }} />
            {!requiresTwoFactor ? (
                <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Sign In</h3>}>
                    <p style={{ marginBottom: 10 }}>
                        <span className="text-muted">New Here? </span>{' '}
                        <Link to="/sign-up"> Create an Account</Link>
                    </p>
                    <Form fluid>
                        <Form.Group>
                            <Form.ControlLabel>Username or email address</Form.ControlLabel>
                            <Form.Control name="email" value={email}
                                onChange={(value: string | number) => setEmail(value as string)}
                                required />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>
                                <span>Password</span>
                                <a style={{ float: 'right' }}>Forgot password?</a>
                            </Form.ControlLabel>
                            <Form.Control name="password" type="password"
                                value={password}
                                onChange={(value: string | number) => setPassword(value as string)}
                                required />
                        </Form.Group>
                        <Form.Group>
                            <Stack spacing={6} divider={<Divider vertical />}>
                                {authState.isLoading ? (
                                    <Loader style={{ width: '100%', textAlign: 'center' }} content="Processing..." />
                                ) : (
                                    <Button appearance="primary" block onClick={handleSignIn}>
                                        Sign in
                                    </Button>
                                )}
                            </Stack>
                            <Stack spacing={6}>
                                <IconButton icon={<WechatIcon />} appearance="subtle" />
                                <IconButton icon={<GithubIcon />} appearance="subtle" />
                                <IconButton icon={<FacebookIcon />} appearance="subtle" />
                                <IconButton icon={<GoogleIcon />} appearance="subtle" />
                            </Stack>
                        </Form.Group>
                    </Form>
                </Panel>
            ) : (
                <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Authentication</h3>}>
                    <Form>
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                            The verification code has been sent to your email
                        </p>
                        <Form.Group>
                            <Form.ControlLabel>Verification code</Form.ControlLabel>
                            <Form.Control
                                name="twoFactorCode"
                                value={twoFactorCode}
                                onChange={(value: string | number) => setTwoFactorCode(value as string)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Stack spacing={10}>
                                {authState.isLoading ? (
                                    <Loader content="Processing..." />
                                ) : (
                                    <Button appearance="primary" block onClick={handleTwoFactorLogin}>
                                        Authentication
                                    </Button>
                                )}
                            </Stack>
                        </Form.Group>
                        <Form.Group>
                            <p style={{ textAlign: 'center', color: 'red' }}>
                                Time left.: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                            </p>
                        </Form.Group>
                    </Form>
                </Panel>
            )}
        </Stack>
    );
};

export default withNetwork(SignUp);
