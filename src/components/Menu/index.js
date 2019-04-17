import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {
    Menu,
    Icon
} from 'antd';

import {MenuConfig} from './MenuConfig';
import {withNamespaces} from "react-i18next";

class MenuContainer extends Component {
    state = {
        activeKey: ''
    };

    componentDidMount() {
        let pathname = this.props.location.pathname;
        let activeKey = pathname && pathname !== '/' ? pathname.split('/')[1] : 'dashboard';
        this.setState({activeKey: activeKey})
    }

    onClick = (selectedKeys) => {
        this.setState({activeKey: selectedKeys});
    };

    render() {
        const {t} = this.props;

        let {activeKey} = this.state;
        return (
            <Menu
                theme={'dark'}
                className={'_sidebar-menu '}
                selectedKeys={[activeKey]}
                mode="inline"
                onSelect={({selectedKeys}) => this.onClick(selectedKeys)}
                inlineCollapsed={true}
            >
                {MenuConfig.map((menuItem) => {
                    return (
                        <Menu.Item
                            className={`sidebarleft__menu--item`}
                            key={menuItem.key}>
                            <Link className={`_menu-${menuItem.key} dpl-flex justify-content `}
                                  to={menuItem.link}
                            >
                                <Icon type={menuItem.icon} width={22} className='txt-color-white'/>
                                <span className={"txt-color-white"}>{t(menuItem.label)}</span>
                            </Link>
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
    }
}

export default withRouter(withNamespaces()(MenuContainer));
