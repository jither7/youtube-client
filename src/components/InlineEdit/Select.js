import React from 'react'
import PropTypes from 'prop-types'
import {Input, Icon, Select} from "antd";
import {withNamespaces} from "react-i18next";
import lodash from 'lodash'

class InlineSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInline: false,
            isInputFocus: false,
            originValue: '',
            value: null,
            isLoading: false,
            inputError: null,
            attributeError: null,
            canEdit: false,

        };

        this.isFocus = false;
        this.inputFocusRef = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, preState) {
        let nextState = {...preState};
        if (JSON.stringify(nextProps.value) !== JSON.stringify(preState.originValue)) {
            nextState.originValue = nextProps.value;
            nextState.value = nextProps.value;
            nextState.isLoading = false;
            nextState.showInline = false;
        }

        if (JSON.stringify(nextProps.isUpdateFailed) !== JSON.stringify(preState.isUpdateFailed)) {
            nextState.isLoading = false;
            nextState.isUpdateFailed = nextProps.isUpdateFailed;
        }

        if (nextProps.canEdit !== preState.canEdit) {
            nextState.canEdit = nextProps.canEdit;
            if (!nextProps.canEdit) {
                nextState.showInline = false;
            }

        }

        if (JSON.stringify(nextState) !== JSON.stringify(preState)) {
            return nextState;
        }
        return null;
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onPressEsc.bind(this));
        window.addEventListener('focusout', this.onFocusout.bind(this));
    }

    componentDidUpdate() {
        if (this.isFocus) {
            this.isFocus = false;
            this.inputFocusRef.focus();
        }
    }

    /**
     * @param e
     */
    onPressEsc(e) {
        if (e.keyCode === 27 && this.state.isInputFocus) {
            this.setState({
                showInline: false,
                isInputFocus: false,
                value: this.state.originValue,
                error: null,
                attributeError: null
            });

        }
    }

    onInputKeyPress(e) {
        this.onRegexValue(e)
    }

    /**
     * show/close inline edit
     * @param e
     */
    onShowInline(e) {
        let show = !this.state.showInline;
        this.setState({
            showInline: show,
            error: null,
            attributeError: null
        });
        if (show) {
            this.isFocus = true;
            this.setState({isInputFocus: true})
        } else {
            this.setState({
                isInputFocus: false,
                value: this.state.originValue
            })
        }
    }

    /**
     * @param e
     */
    onFocus(e) {
        this.setState({isInputFocus: true})
    }

    /**
     *
     * @param e
     */
    onFocusout(e) {
        this.isFocus = false;
        this.setState({isInputFocus: false})
    }

    /**
     *
     * @param value
     */
    onInputChange = (value) => {
        this.setState({value})
    };

    /**
     * Submit
     * @param e
     */
    onSubmit(e) {
        let value = this.state.value;
        if (value != this.state.originValue && !this.state.error) {
            this.setState({isLoading: true});
            this.props.onOk(value);
        }
    }

    render() {
        const {showInline, error, attributeError} = this.state;
        const {t, wrappedClass, options} = this.props;

        let canNotSubmit = error || (this.state.value == this.state.originValue);



        return (
            <div className={`${wrappedClass || ''}`}>
                <label className={`lb-title`}>
                    {this.props.title}
                </label>

                {(this.props.canEdit && !this.state.isLoading ) && (
                    !showInline ?
                        <Icon className={`${this.props.iconClassName} _icon-edit icon-edit pl-2`} type="edit" onClick={e => this.onShowInline(e)} />
                        :
                        <span className={"pl-2"}>
                        <Icon className={`icon-edit _icon-close`} type="close" onClick={e => this.onShowInline(e)} />
                        <Icon
                            className={`icon-edit ${canNotSubmit ? 'text--gray pointer--not' : ''} _icon-submit`}
                            type="check"
                            onClick={e => this.onSubmit(e)}
                        />
                    </span>
                )}

                {this.state.isLoading && <Icon className={` _icon-edit pl-2`} type="loading" />}

                <br/>
                {showInline ? (
                        <div>
                            <span>
                                <Select
                                    className={`_inp-inline`}
                                    style={{ width: 300 }}
                                    value={this.state.value}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder={this.props.title}
                                    ref={(ref) => {this.inputFocusRef = ref}}
                                    onChange={this.onInputChange}
                                    onKeyPress={e => this.onInputKeyPress(e)}
                                    onFocus={e => this.onFocus(e)}
                                >
                                    {options.map(option =>
                                        <option value={option.key} key={option.key}>{option.value}</option>
                                    )}
                                </Select>
                                {this.props.lastPrefixInput}
                            </span>

                            {error &&
                            <p className="_message-error text--red">
                                {t(`validation.${error}`, {
                                    attribute: this.props.titleMessage || this.props.title,
                                    max: attributeError,
                                })}
                            </p>
                            }
                        </div>

                    )
                    :
                    !this.props.isNotShowValue && (
                        <span>
                        <span className={'_content'}>{this.props.text} </span>{this.props.lastPrefixInput}
                    </span>)
                }
            </div>
        )
    }
}

InlineSelect.propTypes = {
    title: PropTypes.string,
    titleMessage: PropTypes.string, // used show error if not use title
    value: PropTypes.any,
    options: PropTypes.array, // data select
    placeholder: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    canEdit: PropTypes.bool,
    isUpdateFailed: PropTypes.any,
    lastPrefixInput: PropTypes.any,
    isNotShowValue: PropTypes.bool, // don't show value when not edit
    validates: PropTypes.object, // {required: true, maxLength: 88, regex: //}
    wrappedClass: PropTypes.string,
};
export default withNamespaces()(InlineSelect);