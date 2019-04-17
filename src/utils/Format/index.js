import moment from 'moment'
import numeral from 'numeral';

export default class Format {
    /**
     *
     * @param date
     * @returns {string}
     */
    static date(date) {
        return moment(date).format("DD/MM/YYYY");
    }

    static full(date) {
        return moment(date).format("HH:mm DD/MM/YYYY");
    }

    static hour(date) {
        return moment(date).format("HH:mm A");
    }

    /**
     * format số giây hết hạn của accesstoken
     * @param value
     * @returns {*}
     */
    static formatSecondAccessTokenValidity(value) {
        return numeral(value).format('0,0');
    }

    static isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    static formatNumber(value) {
        return numeral(value).format('0,0');
    }

    /**
     * format đơn giá
     * @param value
     * @param key: , hoặc . theo locale
     * @returns {*}
     */
    static formatPrice(value, key = ',') {
        value = value.toString();
        value = value.replace(/[.]/g, '');
        if (value.indexOf(key) > 0) {
            let temp = value.split(key);
            return `${temp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${key}${temp[1]}`;
        } else {
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

    }

    /**
     * format đơn giá
     * @param value
     * @param unit đơn vị tiền
     * @returns {*}
     */
    static formatPriceByUnit(value, unit) {
        let unitTxt = '';
        switch (unit) {
            case 'CNY':
                unitTxt = '¥';
                break;
            case 'USD':
                unitTxt = '$';
                break;
            default:
                unitTxt = 'đ';
                break;
        }
        return `${numeral(value).format('0,0.[0000]')}${unitTxt}`;

    }

    /**
     * format đơn giá
     * @param value
     * @returns {*}
     */
    static formatValue(value) {
        return `${numeral(value).format('0,0.[0000]')}`;

    }

    /**
     * format số lượng
     * @param value
     * @returns {*}
     */
    static formatQuantity(value) {
        return numeral(parseInt(value)).format('0,0');
    }

    /**
     * Format current
     * @param value
     * @param locale
     */
    static formatCurrent(value, locale = 'de-DE') {
        if (value) {
            return new Intl.NumberFormat(locale, {maximumFractionDigits: 4}).format(value);
        }
        return null;
    }
}