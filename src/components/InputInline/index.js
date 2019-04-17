import React from 'react'
import PropTypes from 'prop-types'
import {withNamespaces} from "react-i18next";
import {Icon, Typography} from "antd";
import lodash from "lodash";
const {Paragraph} = Typography;
const enhanceWithClickOutside = require('react-click-outside');

class InputInline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            editing: false,
        }
    }

    handleClickOutside = (evt) => {
        this.setState({editing: false});
    };

    static getDerivedStateFromProps(nextProps, preState) {
        let nextState = {...preState};
        if (JSON.stringify(nextProps.value) !== JSON.stringify(preState.value)) {
            nextState.value = nextProps.value;
            nextState.editing = false;
            return nextState;
        }
        return null;
    }

    /**
     * Change
     */
    onChangeEditing = () => {
        this.setState({editing: !this.state.editing});
    };

    onPressEnter = (value) => {
        if (value !== this.props.value) {
            this.props.onPressEnter(value);
        }
    };

    render() {
        const {value, editing} = this.state;
        const {loading} = this.props;

        return (
            <React.Fragment>

                {!editing &&
                    <span className="txt-size-h7 txt-color-black robotobold _txt-title">
                        {value || '---'}
                        <Icon
                            onClick={this.onChangeEditing}
                            type="edit"
                            className='txt-color-blue cursor-pointer pdl10'
                        />
                    </span>
                }
                {editing &&
                    <span className='dpl-block pdr5'>
                        <Paragraph
                            editable={{
                                editing: true,
                                onChange: this.onPressEnter
                            }}
                        >
                            {value}
                        </Paragraph>
                        {loading && <Icon type="loading" />}
                    </span>
                }
            </React.Fragment>
        )
    }

}

InputInline.propTypes = {
    value: PropTypes.string,
    onPressEnter: PropTypes.func,
    loading: PropTypes.bool,
};

export default enhanceWithClickOutside(InputInline);