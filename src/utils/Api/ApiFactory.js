import axios from 'axios';
import CancelToken from './CancelToken';

class ApiFactory {
    constructor(baseUrl, auth = null) {
        this.baseUrl = baseUrl;
        this.auth = auth;
    }

    make() {
        let auth = this.auth;
        let cancelToken = new CancelToken();

        let api = axios.create({
            baseURL: this.baseUrl,
        });

        //region -- declare functions --
        let setAuthorizationHeader = function (config) {
            config.headers = {
                ...config.headers,
                'Access-Control-Allow-Headers': 'Authorization',
                'Authorization': 'Bearer ' + auth.getToken(),
            };
        };
        let ensureSingleRequest = function (config) {
            let url = config.url;
            if (config.singleRequest) {
                let lastIndexOf = url.lastIndexOf('/');
                if (lastIndexOf) {
                    url = url.substr(0, lastIndexOf + 1);
                }
                delete config.singleRequest;
            }
            // if (!config.noCancelRequest) {
            //     config.cancelToken = cancelToken.create(config.method + '::' + url);
            // }
        };
        //endregion

        api.interceptors.request.use(config => {
            config.params = config.params || {};

            if (auth) {
                setAuthorizationHeader(config);
            }

            if (config.method === 'get') {
                ensureSingleRequest(config);
            }

            return config;
        }, error => {
            return Promise.reject(error);
        });

        api.interceptors.response.use(response => {
            return response;
        }, error => {
            if (axios.isCancel(error)) {
                return {};
            }

            // if (!error.response) {
            //     error.data={
            //         title:'message.network_error'
            //     }
            //     return Promise.reject(error)
            // }

            if (!navigator.onLine) {
                let error = {
                    code: 999,
                    message: 'Network Error',
                    title:'message.network_error',
                    data:{
                        title:'message.network_error'
                    }
                };
                return Promise.reject(error);
            }
            if (!error.response) {
                let error = {
                    message: 'message.503',
                    title:'message.503',
                    data:{
                        title:'message.503'
                    }
                };
                return Promise.reject(error)
            }
            // if(error.response.data.title==='Internal Server Error')
                error.response.data.title = `message.${error.response.data.title}`;
            if (error.response.status === 401) {
                setTimeout(() => {
                    window.location = process.env.REACT_APP_LOGIN_URL;
                }, 1500);
                return Promise.reject(error.response);
            }
            return Promise.reject(error.response);
        });

        return api;
    }
}

export default ApiFactory;
