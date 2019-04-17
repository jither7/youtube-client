import React, {Component} from 'react';
import DocumentTitle from "react-document-title";
import {LocalStore} from "../../utils/LocalStore";
import UserModel from "../../models/UserModel";

import {
    Layout,
    Avatar,
    Popover,
    Icon,
    Input
} from 'antd';
import MenuContainer from '../Menu'
import ProgressBar from "../Spinner/ProgressBar";
const Search = Input.Search;

let {
    Header, Sider, Content,
} = Layout;

const PERCENT_COMPLETE = 100;

class MainLayout extends Component {

    static defaultProps = {
        isLoadingPopup: false,
        isFocusSubmit: false
    };

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            currentLoggedUser: {},
            percent: -1,
            autoIncrement: false,
            intervalTime: 200
        }
    }

    // scroll top khi bắt đầu load trang
    componentDidMount() {
        window.scrollTo(0, 0);
        if (typeof LocalStore.getInstance().read('currentLoggedUser') === 'object') {
            this.setState({
                currentLoggedUser: LocalStore.getInstance().read('currentLoggedUser') || {}
            });
        }
    }

    /**
     * Đăng xuất
     */
    logout = () => {
        UserModel.logout()
    };

    /**
     *
     * @returns {*}
     */
    renderDropDownAvatar = () => {
        return <div>
            <p className="mgbt5 mgt5">
                <span onClick={this.logout} className="_logout-btn txt-color-blue cursor-pointer">Đăng xuất</span>
            </p>
        </div>
    };
    /**
     *
     */
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.showProgressBar !== this.props.showProgressBar) {
            // hiển thị progress bar
            if (this.props.showProgressBar === true) {
                this.startWithAutoIncrement();
            } else {
                // this.stopWithAutoIncrement();
                this.setPercent(PERCENT_COMPLETE);
            }
        }
    }

    /**
     * hiển thị progressbar
     **/
    startWithAutoIncrement = () => {
        this.setState({
            percent: 0,
            autoIncrement: true,
            intervalTime: (Math.random() * 150)
        });
    };

    /**
     * Dừng progressbar
     **/
    stopWithAutoIncrement = () => {
        setTimeout(() => {
            this.setState({
                percent: -1,
                autoIncrement: false,
                intervalTime: 150
            });
        }, 500);
    };

    setPercent = (percent) => {
        this.setState({
            percent: percent
        }, () => {
            if (percent === PERCENT_COMPLETE) {
                this.stopWithAutoIncrement();
            }
        });
    };

    render() {
        const {title, children, headPage} = this.props;
        const {percent, autoIncrement, intervalTime, currentLoggedUser, collapsed} = this.state;

        return (
            <DocumentTitle title={`${title ? title + ' | ' : ''} M2`}>
                <div className={`${collapsed ? 'menu-collapsed' : ''}`} style={{height:'100%'}}>

                    <Sider
                        defaultCollapsed={true}
                        trigger={null}
                        collapsible

                        collapsedWidth={'240px'}
                        className={"sidebarleft"}>
                        <div className="sidebarleft__logo" >
                            <Avatar src="" size={30} shape={'square'} icon={'app'}/>
                        </div>

                        <MenuContainer collapsed={collapsed}/>

                    </Sider>
                    <Layout>
                        <Header className={"header mgbt15"}>
                            <div className={'container'}>
                                <div className={'dpl-flex justify-content-between mgr20 border-bottom-2x bd-color-gray'}>
                                    <div className={'header__left dpl-flex justify-content-start pdt20 pdbt20'}>
                                        <Icon
                                            className="trigger txt-color-black txt-size-h4 line-height134 mgr10 pdt8"
                                            type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                        />
                                        <h2 className={'txt-size-h1 txt-color-black2 robotobold line-height134 pdr5'}>{headPage? headPage: "Quản lý đơn hàng"}</h2>
                                        <span className={'txt-size-h8 txt-color-blue line-height134 pdt10 mgr5 mgl5'}>|</span>
                                        <a href="#" className={'txt-size-h8 txt-color-blue robotoregular line-height134 pdl5 pdt10'}> Đổi ngôn ngữ</a>
                                    </div>
                                    <div className={'header__right dpl-flex align-items-center'}>
                                            <Search
                                                placeholder="Nhập từ khóa tìm kiếm..."
                                                onSearch={value => console.log(value)}
                                                style={{ width: 200 }}
                                                className={"header__right_search position-re mgr30"}
                                            />

                                        <Icon type="bell"  className={"txt-size-h5 mgr15"}/>

                                        <Popover placement="bottomRight" content={this.renderDropDownAvatar()} trigger="click">
                                            <div className={'drop-down-user cursor-pointer dpl-flex _header-user-info'}>
                                                <Avatar src={currentLoggedUser.avatar} className={"mgt5"}/>
                                                <div className="_user-title pdl10">
                                                    <p className={'_user-name mgt15 line-height-1 txt-size-h7 robotomedium txt-color-black'}>{currentLoggedUser.fullname}</p>
                                                </div>
                                            </div>
                                        </Popover>

                                    </div>
                                </div>
                            </div>
                        </Header>
                        <ProgressBar
                            percent={percent}
                            autoIncrement={autoIncrement}
                            intervalTime={intervalTime}
                            spinner={false}
                        />
                        <Content>
                            <div className={'container mgt5'}>
                            {children}
                            </div>
                        </Content>
                    </Layout>
                </div>
            </DocumentTitle>
        )
    }
}


export default MainLayout;