import React from 'react'
import PropTypes from 'prop-types'

class MessageRender extends React.Component {
    render() {
        const {message, className} = this.props;
        return (
            <span className={className || ''}>{message}</span>
        )
    }
}

MessageRender.propTypes = {
    message: PropTypes.string,
    className: PropTypes.string,
};

export default MessageRender;