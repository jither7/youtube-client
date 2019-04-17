import React from 'react'
import {Icon} from "antd/lib/index";
import PropTypes from 'prop-types'

class ClearIcon extends React.Component {
    render() {
        const {className} = this.props;
        return <Icon className={`_select-clear-icon ${className}`} type={"close"}/>
    }
}

ClearIcon.propTypes = {
    className: PropTypes.string,
};

export default ClearIcon;