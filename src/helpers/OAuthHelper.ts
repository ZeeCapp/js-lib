import Axios from 'axios';
import { ITokenData } from '../interfaces/ITokenData';

export class OAuthHelper {
    static finishAuthorization = (wsUrl: string, clientId: string, clientSecret: string, codeVerifier: string, authorizationCode: string, redirectUrl: string, callback: (tokenData: ITokenData) => void) => {
        const params = new URLSearchParams();
        params.append('code_verifier', codeVerifier);
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('code', authorizationCode);
        params.append('redirect_uri', redirectUrl);
        params.append('grant_type', 'authorization_code');

        OAuthHelper.callTokenEndpoint(wsUrl, params, callback);
    }

    static refreshToken = (wsUrl: string, clientId: string, clientSecret: string, refreshToken: string, callback: (tokenData: ITokenData) => void) => {
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('refresh_token', refreshToken);
        params.append('grant_type', 'refresh_token');

        OAuthHelper.callTokenEndpoint(wsUrl, params, callback);
    }

    private static callTokenEndpoint = (wsUrl: string, params: URLSearchParams, callback: (tokenData: ITokenData) => void) => {
        Axios.post(wsUrl + '/auth/connect/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then((response) => {
            callback(response.data);
        }, () => {
            throw new Error('Token request failed');
        });
    }
}