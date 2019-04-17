import React from "react";
import {Icon, Layout, Spin} from "antd";
import {withNamespaces} from 'react-i18next';

class Loading extends React.Component {
    render() {
        const {t, message, height} = this.props;
        return (
            <Layout className="layout_white txt-center _layout-loading justify-content-center" style={{height: height || "100vh"}}>
                <Spin indicator={<Icon type={"loading"}/>} />
                <span>{message ? message : t('message.loading')}</span>
            </Layout>
        );
    }
}

export default withNamespaces()(Loading);