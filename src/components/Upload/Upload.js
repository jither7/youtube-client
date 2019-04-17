import React from 'react';
import {withNamespaces} from "react-i18next";
import PropTypes from 'prop-types';
import {Upload} from 'antd'
import LocaleReceiver from "antd/es/locale-provider/LocaleReceiver";
import RcUpload from 'rc-upload';
import classNames from 'classnames';
import defaultLocale from "antd/es/locale-provider/default";
import {ConfigConsumer} from "antd/es/config-provider/index";
import UploadList from "antd/es/upload/UploadList.js";

class UploadCustom extends Upload {

    renderUploadList = (locale) => {
        const {showUploadList, listType, onPreview} = this.props;
        const {showRemoveIcon, showPreviewIcon} = showUploadList;
        return (
            <UploadList
                listType={listType}
                items={this.state.fileList}
                onPreview={onPreview}
                onRemove={this.handleManualRemove}
                showRemoveIcon={showRemoveIcon}
                showPreviewIcon={showPreviewIcon}
                locale={{...locale, ...this.props.locale}}
            />
        );
    };

    renderUpload = ({getPrefixCls}) => {
        const {
            prefixCls: customizePrefixCls,
            className,
            showUploadList = true,
            listType,
            type,
            disabled,
            children,
            hook,
        } = this.props;

        const prefixCls = getPrefixCls('upload', customizePrefixCls);

        const rcUploadProps = {
            onStart: this.onStart,
            onError: this.onError,
            onProgress: this.onProgress,
            onSuccess: this.onSuccess,
            ...this.props,
            prefixCls,
            beforeUpload: this.beforeUpload,
        };

        delete rcUploadProps.className;

        const uploadList = showUploadList ? (
            <LocaleReceiver componentName="Upload" defaultLocale={defaultLocale.Upload}>
                {this.renderUploadList}
            </LocaleReceiver>
        ) : null;

        if (type === 'drag') {
            const dragCls = classNames(prefixCls, {
                [`${prefixCls}-drag`]: true,
                [`${prefixCls}-drag-uploading`]: this.state.fileList.some(
                    file => file.status === 'uploading',
                ),
                [`${prefixCls}-drag-hover`]: this.state.dragState === 'dragover',
                [`${prefixCls}-disabled`]: disabled,
            });
            return (
                <span className={className}>
          <div
              className={dragCls}
              onDrop={this.onFileDrop}
              onDragOver={this.onFileDrop}
              onDragLeave={this.onFileDrop}
          >
            <RcUpload {...rcUploadProps} ref={this.saveUpload} className={`${prefixCls}-btn`}>
              <div className={`${prefixCls}-drag-container`}>
                  {children}</div>
            </RcUpload>
          </div>
                    {uploadList}
        </span>
            );
        }

        const uploadButtonCls = classNames(prefixCls, {
            [`${prefixCls}-select`]: true,
            [`${prefixCls}-select-${listType}`]: true,
            [`${prefixCls}-disabled`]: disabled,
        });

        if (!children) {
            delete rcUploadProps.id;
        }
        const uploadButton = (
            <div className={uploadButtonCls} style={children ? undefined : {display: 'none'}}>
                <RcUpload {...rcUploadProps} ref={this.saveUpload}/>
                {hook}
            </div>
        );

        if (listType === 'picture-card') {
            return (
                <React.Fragment>
                <span>
                 {uploadButton}
                </span>
                    <div className={className}>
                        {uploadList}
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <div className='bd1px bd-color-gray bdt0 bg-color-white pdbt5 pdr5'>
                 {uploadButton}
                </div>
                <div className={`${className} bg-color-gray`}>
                    {uploadList}
                </div>
            </React.Fragment>

        );
    };

    render() {
        return <ConfigConsumer>{this.renderUpload}</ConfigConsumer>;
    }
}

UploadCustom.defaultProps = {};

UploadCustom.propTypes = {};


export default withNamespaces()(UploadCustom);