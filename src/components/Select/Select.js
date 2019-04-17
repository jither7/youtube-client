import React from 'react'
import {Select} from 'antd'
import ClearIcon from "./ClearIcon";
import PropTypes from 'prop-types'

class SelectCustom extends React.Component {
    render() {
        const {forwardedRef, clearIconClassName} = this.props;
        return <Select
            {...this.props}
            ref={forwardedRef ? forwardedRef : null}
            clearIcon={<ClearIcon className={clearIconClassName} />}
        />
    }
}

SelectCustom.propTypes = {
    clearIconClassName: PropTypes.string
};

export default SelectCustom;