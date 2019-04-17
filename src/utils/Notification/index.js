import React from 'react'
import {message, notification} from 'antd'
import MessageRender from './MessageRender'

export default class Notification {
    /**
     *
     * @param messages
     * @param className
     * @param duration
     * @param onClose
     */
    static messageSuccess(messages, className, duration = 5, onClose) {
        message.success(<MessageRender
            message={messages}
            className={className}
        />, duration, onClose)
    }

    /**
     *
     * @param messages
     * @param className
     * @param duration
     * @param onClose
     */
    static messageError(messages, className, duration = 3, onClose) {
        message.error(<MessageRender
            message={messages}
            className={className}
        />, duration, onClose)
    }

    /**
     *
     * @param messages
     * @param className
     * @param duration
     * @param onClose
     */
    static messageWarning(messages, className, duration, onClose) {
        message.warning(<MessageRender
            message={messages}
            className={className}
        />, duration, onClose)
    }

    static notifySuccess(title, messages, className, duration, onClose) {
        notification['success']({
            message: title,
            description: messages,
            className: className,
            duration: duration,
            onClose: onClose
        });
    }

    static notifyError(title, messages, className, duration = 0, onClose) {
        notification['error']({
            message: title,
            description: <MessageRender
                message={messages}
                className="_error-message"
            />,
            className:className,
            duration: duration,
            onClose: onClose
        });
    }

    static notifyWarning(title, messages, className, duration, onClose) {
        notification['warning']({
            message: title,
            description: messages,
            className: className,
            duration: duration,
            onClose: onClose
        });
    }
}


