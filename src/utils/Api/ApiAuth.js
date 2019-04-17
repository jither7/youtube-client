import cookies from 'react-cookies';
import {LocalStore} from "../LocalStore";

class ApiAuth {
    constructor(storageKey = 'token_customer') {
        this.storageKey = storageKey;
    }

    getToken() {
        let token = LocalStore.getInstance().read('loginSession');
        if(token)
            return token.id;
        return null;
    }

    setToken(token) {
        cookies.save(this.storageKey, token, {path: '/'});
    }

    removeToken() {
        cookies.remove(this.storageKey, {path: '/'});
    }
}

export default ApiAuth;