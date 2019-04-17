import React from 'react'
import DocumentTitle from "react-document-title"
import {LocalStore} from "../../utils/LocalStore";
import UserModel from "../../models/UserModel";

import loadingGif from '../../resources/images/loading.gif'
import errorPng from '../../resources/images/error.png'
import {withNamespaces} from 'react-i18next';
import {parseQueryStringToObject} from "../../utils/stringUtils";

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        const {t} = props;
        this.state = {
            isNotPermission: false,
            msg: t('message.authenticating')
        }
    }

    componentWillMount() {
        const {history, t} = this.props;
        // Hủy sự kiện cảnh báo khi load trang
        window.onbeforeunload = null;

        let queryString = this.props.location.search || '';
        if (queryString.indexOf('?') > -1) {
            queryString = queryString.replace(/\?/g, '')
        }
        const params = parseQueryStringToObject(queryString);

        // clear old session
        LocalStore.getInstance().save('loginSession', null);
        LocalStore.getInstance().save('currentLoggedUser', null);

        // check authentication
        if (params && params['access_token']) {
            //lưu access_token vào local
            LocalStore.getInstance().save('loginSession', {id: params.access_token});

            //query với access_token để lấy user
            UserModel.getCurrentUser().then(res => {
                const redirectUrl = LocalStore.getInstance().read('redirectUrl') || '/';
                LocalStore.getInstance().save('currentLoggedUser', res.data);
                LocalStore.getInstance().save('redirectUrl', null);
                this.setState({msg: t('message.welcome',{
                    username: res.data.fullname
                    })}, () => {
                    setTimeout(() => {
                        if (redirectUrl === '/') {
                            history.replace(redirectUrl);
                        } else {
                            let link = redirectUrl.split('#');
                            history.replace(link[1]);
                        }
                    }, 1500)
                });
            }).catch(error => {
                LocalStore.getInstance().save('loginSession', null);
                this.setState({
                    isNotPermission: true,
                    msg: error.message
                })
            });
        } else {
            this.setState({msg: t('message.authenticating')}, () => {
                setTimeout(() => {
                    window.location = process.env.REACT_APP_LOGIN_URL; //window.location = null
                }, 1500)
            });
        }
    }

    logout = () => {
        UserModel.logout()
    };

    render() {
        return (
            <DocumentTitle title={`M2`}>
                <div className={'splash-container'}>
                    {
                        !this.state.isNotPermission
                            ?
                            <div className="dpl-flex flex-direction-column">
                                <img src={loadingGif} alt="" style={{margin: 'auto'}}/>
                                <p className="splash-text txt-color-black2 mgt25">
                                    {this.state.msg}
                                </p>
                            </div>
                            :
                            <div className={'text-center margin-auto utmhelve-regular'}>
                                <div className={'text-center margin-auto utmhelve-regular'}>
                                    <img src={errorPng} alt=""/>
                                </div>
                                <div className="txt-center">
                                    <p className="splash-text txt-color-black2 mgt20">
                                        Máy chủ phản hồi quá chậm.
                                    </p>
                                    <p className="splash-text txt-color-black2 mgt20">
                                        Bạn có thể thử lại hoặc liên hệ quản lý để được hỗ trợ.
                                    </p>
                                    <div className={'mgt50'}>
                                        <a href="#" className="splash-text txt-color-blue2 ">
                                            <i className="fas fa-undo-alt mgr5"/> <span>Thử lại</span>
                                        </a>
                                        <a onClick={this.logout}
                                           className="splash-text cursor-pointer txt-color-blue2 mgl25">
                                            <i className="fas fa-sign-out-alt mgr5"/> <span>Đăng xuất</span>
                                        </a>
                                    </div>

                                </div>
                            </div>
                    }
                </div>
            </DocumentTitle>
        );
    }
}

export default withNamespaces()(Authentication);