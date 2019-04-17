import {LocalStore} from "../../utils/LocalStore/index";
// import _ from 'lodash';

const localStore = LocalStore.getInstance();
let language = localStore.read("language");

if(!language){
    language = 'vi';
}


let lang = (function lang(_language) {
    switch (_language){
        case 'en' : return require('./locals/en/en.json');
        case 'vi' : return require('./locals/vn/vn.json');
        default : return require('./locals/en/en.json');
    }
})(language);

export const localization = language;

export default lang;