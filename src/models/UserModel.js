import {apiWithToken} from "../utils/Api";
import {LocalStore} from "../utils/LocalStore";

export default class UserModel {

    /**
     * Lấy thông tin của user đang đăng nhập
     */
    static getCurrentUser(){
        return apiWithToken.get('/users/me');
    }

    /**
     * đăng xuất
     * @param cb
     */
    static logout(cb) {
        // Hủy sự kiện cảnh báo khi load trang
        window.onbeforeunload = null;
        LocalStore.getInstance().save('loginSession', null);
        window.location = process.env.REACT_APP_LOGOUT_URL
    }
}