import { customApi } from '..'
import defaultApi from '../http/DefaultApi'
import { IAuthDto } from '../interfaces/dto/IAuthDto'
import { ITwoFactorLogin } from '../interfaces/dto/ITwoFactorLoginDto'
import { IUserData } from '../interfaces/entity/IUserData'
import { getDeviceFingerprint } from '../utils/fingerprintjs'
import * as yup from 'yup'

export class AuthService {

    static authDtoSchema = yup.object().shape({
        Email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
        Password: yup.string().min(4, "Mật khẩu không hợp lệ").required("Mật khẩu là bắt buộc"),
    });

    static validateAuth = async (authDto: IAuthDto): Promise<string[] | null> => {
        try {
            await AuthService.authDtoSchema.validate(authDto, { abortEarly: false });
            return null;
        } catch (error) {
            return (error as yup.ValidationError).errors;
        }
    }
    static registration = async (authDto: IAuthDto): Promise<IUserData> => {
        try {
            const response = await defaultApi.post<IUserData>('Auth/Registration', authDto, {
                headers: {
                    'device-fingerprint': await getDeviceFingerprint(),
                },
            })

            var data = response.data

            // localStorage.setItem('AccessToken', data.tokensData.accessJwt)

            return data
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }

    static login = async (authDto: IAuthDto): Promise<IUserData> => {
        try {
            const errors = await AuthService.validateAuth(authDto);
            if (errors) {
                console.log("Lỗi xác thực:", errors);
                throw new Error("Tài khoản hoặc mật khẩu không hợp lệ");
            }
            const response = await defaultApi.post<IUserData>('Auth/Login', authDto, {
                headers: {
                    'device-fingerprint': await getDeviceFingerprint(),
                },
            });
            const data = response.data;
            //  console.log(data.requiresTwoFactor);           
            return data;
        } catch (error: any) {
            const errorMessage = error?.response?.data || "Lỗi không xác định khi đăng nhập";
            throw new Error(errorMessage);
        }
    }

    static twofactorlogin = async (twofactorDto: ITwoFactorLogin): Promise<IUserData> => {
        try {
            const response = await defaultApi.post<IUserData>('Auth/verify-2fa-login', twofactorDto, {
                headers: {
                    'device-fingerprint': await getDeviceFingerprint(),
                },
            });
            const data = response.data;
            // console.log(data);
            return data;
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }

    static logout = async (): Promise<void> => {
        try {
            await customApi.delete<void>('Auth/Logout')

            localStorage.removeItem('_ACT_AUT')
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }

    static refresh = async (): Promise<IUserData> => {
        try {
            const accessToken = localStorage.getItem('_ACT_AUT')
            const response = await defaultApi.put<IUserData>('Auth/Refresh', accessToken, {
                headers: {
                    'device-fingerprint': await getDeviceFingerprint(),
                },
            })

            var data = response.data
            // console.log(data);
            localStorage.setItem('_ACT_AUT', data.tokensData.accessJwt)

            return data
        } catch (error: any) {
            console.error(error.response.data)
            throw error
        }
    }
}
