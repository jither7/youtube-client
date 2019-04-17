import axios from 'axios';

class CancelToken {
    constructor() {
        this.cancels = {};
    }

    create(key) {
        let source = axios.CancelToken.source();

        if (this.cancels[key]) {
            this.cancels[key]();
        }

        this.cancels[key] = source.cancel;

        return source.token;
    }
}

export default CancelToken;