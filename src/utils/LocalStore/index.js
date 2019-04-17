import {cookieReadObject, cookieSaveObject} from "./cookie";
import {isLocalStorageAvailble, localStorageReadObject, localStorageSaveObject} from "./localStorage";

/**
 * Singleton LocalStore
 * @type {{getInstance}}
 */
export const LocalStore  = (function () {
    let instance;

    function createInstance() {
        let object = {};

        if (isLocalStorageAvailble()) {
            object.save = localStorageSaveObject;
            object.read = localStorageReadObject;
        } else {
            object.save = cookieSaveObject;
            object.read = cookieReadObject;
        }

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();