import React from "react";
import {Icon, LocaleReceiver, Pagination} from "antd";
export default class MyPagination extends Pagination{
    getIconsProps = (prefixCls) => {
        const arrowRightSVG=()=>(
            <svg viewBox="64 64 896 896" className="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
        );
        const prevIcon = (
            <a className={`${prefixCls}-item-link preIcon _tab-users-pagination-back`}>
                <Icon type="left" />
            </a>
        );
        const nextIcon = (
            <a className={`${prefixCls}-item-link nextIcon _tab-users-pagination-next`}>
                <Icon component={arrowRightSVG} />
            </a>
        );
        const jumpPrevIcon = (
            <a className={`${prefixCls}-item-link`}>
                {/* You can use transition effects in the container :) */}
                <div className={`${prefixCls}-item-container`}>
                    <Icon className={`${prefixCls}-item-link-icon`} type="double-left" />
                    <span className={`${prefixCls}-item-ellipsis`}>•••</span>
                </div>
            </a>
        );
        const jumpNextIcon = (
            <a className={`${prefixCls}-item-link`}>
                {/* You can use transition effects in the container :) */}
                <div className={`${prefixCls}-item-container`}>
                    <Icon className={`${prefixCls}-item-link-icon`} type="double-right" />
                    <span className={`${prefixCls}-item-ellipsis`}>•••</span>
                </div>
            </a>
        );

        const {hideOnSinglePage, total, pageSize} = this.props;

        let totalPage = Math.ceil(total / pageSize);

        if (hideOnSinglePage && totalPage < 2) {
            return;
        }

        return {
            prevIcon,
            nextIcon,
            jumpPrevIcon,
            jumpNextIcon,
        };
    };
}
