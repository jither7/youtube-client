import React, {Component} from 'react';
import DocumentTitle from "react-document-title"
import Routes from "./Routes";
import {LocalStore} from "./utils/LocalStore";
import UserModel from "./models/UserModel";
import {Layout, LocaleProvider} from "antd";
import {withNamespaces} from 'react-i18next';
import numeral from 'numeral';

import zhCN from 'antd/lib/locale-provider/zh_CN';
import viVN from 'antd/lib/locale-provider/vi_VN';
import enUS from 'antd/lib/locale-provider/en_US';

import Loading from './components/Loading';

import './resources/scss/custom.scss'

const STATE_SUCCESS = 'success';
const STATE_LOADING = 'loading';
const STATE_FAILURE = 'failure';
numeral.register('locale', 'vi', {
    delimiters: {
        thousands: '.',
        decimal: ','
    }
});
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initAppStatus: STATE_LOADING,
            locale: null
        }
    }

    componentWillMount () {
        const localStore = LocalStore.getInstance();
        let language = localStore.read("language");
        if (!language || (language && language === 'vi'))
        {
            this.setState({locale: viVN});
            numeral.locale('vi');
        }
        else if (language === 'en') {
            const {i18n} = this.props;
            i18n.changeLanguage(language);
            this.setState({locale: enUS});
            numeral.locale('en');
        }

        if (!LocalStore.getInstance().read('loginSession')) {
            //lưu lại redirectUrl
            if (window.location.hash && window.location.hash.indexOf('#/authentication') < 0) {
                LocalStore.getInstance().save('redirectUrl', window.location.href);
            }
            this.setState({initAppStatus: STATE_SUCCESS});
        } else {
            //query với access_token để lấy user
            UserModel.getCurrentUser().then(res=>{
                LocalStore.getInstance().save('currentLoggedUser', res.data);
                this.setState({initAppStatus: STATE_SUCCESS});
            }).catch(error=>{
                if (error.code === 401) {
                    window.location = process.env.REACT_APP_LOGIN_URL;
                }
                //khi gọi me thất bại thì coi như là lỗi hệ thống vì có thể có vấn đề xảy ra mà khó lường trước
                LocalStore.getInstance().save('loginSession', null);
                return this.setState({initAppStatus: STATE_FAILURE});
            });
        }
    }

    render() {
        const {t} = this.props;
        switch (this.state.initAppStatus) {
            case STATE_SUCCESS:
                return <div id={"app-main"} className={""}>
                    <LocaleProvider locale={this.state.locale}>
                        <Routes />
                    </LocaleProvider>
                </div>;
            case STATE_FAILURE:
                // TODO: change content of failure page
                return (
                    <div style={{textAlign: 'center', paddingTop: 15, width: '100%'}}>{t('message.try_again')}</div>
                );
            default:
                // show loading page
                return <DocumentTitle title="Loading...">
                    <Layout className={"splash-container"}>
                        <Loading/>
                    </Layout>
                </DocumentTitle>
        }
    }
}

export default withNamespaces('translation')(App);
