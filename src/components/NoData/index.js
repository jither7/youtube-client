import React from "react";
import {Empty, Button} from 'antd';
import {withNamespaces} from "react-i18next";
import PropTypes from 'prop-types';
import lodash from 'lodash'

class NoData extends React.Component {

    render() {
        const {
            message, error, classNameContainer, classNameError,
            classNameBtTryAgain, onRecall, t
        } = this.props;

        let status = lodash.get(error,'status', null);
        let errorMessage = lodash.get(error, 'message', null);
        let networkError = (errorMessage && errorMessage === 'Network Error') || (status && status >= 500);

        return (
            <div className={'pdt20 pdbt30'}>
                <Empty
                    className={`${classNameContainer || '_empty-container'}`}
                    description={
                        <span className={`${classNameError ? classNameError : '_message-no-data'}`}>
                            {networkError ?
                                t('message.try_again')
                                : (message ? message : t('message.no_data'))
                            }
                        </span>
                    }>
                    {networkError &&
                    <Button
                        onClick={onRecall}
                        className={classNameBtTryAgain ? classNameBtTryAgain : '_bt-try-again'}
                        type="primary"
                    >
                        {t('btn.try_again')}
                    </Button>}
                </Empty>
            </div>
        );
    }
}

NoData.propTypes = {
    message: PropTypes.string,
    error: PropTypes.object,
    classNameContainer: PropTypes.string,
    classNameError: PropTypes.string,
    classNameBtTryAgain: PropTypes.string,
    onRecall: PropTypes.func
};

export default withNamespaces()(NoData);