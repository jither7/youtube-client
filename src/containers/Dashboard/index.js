import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';

export default class Dashboard extends React.Component {

    render() {
        return <MainLayout
            {...this.props}
            title={'Dashboard'}
        >
        </MainLayout>;
    }
}
