import ApiAuth from './ApiAuth'
import ApiFactory from './ApiFactory'

let baseURL = typeof process.env.REACT_APP_API_URL !== "undefined" ? (process.env.REACT_APP_API_URL).trim() : "http://localhost/";

let auth = new ApiAuth();
let apiWithToken = (new ApiFactory(baseURL, auth)).make();


export {
    auth, apiWithToken
}