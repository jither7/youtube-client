import moment from "moment/moment";
import lang from "../resources/localization/Localization";

/**
 * Lấy module hiện tại trên URL
 * @returns {string}
 */
export function getCurrentModule(url) {
    return url || window.location.pathname;
}

/**
 *
 * @param obj
 * @returns {string}
 */
export function parseObjectToQueryString(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(p + "=" + obj[p]);
        }
    return str.join("&");
}
/**
 * Parse query string to an object
 * @param queryString
 * @returns {{}}
 */
export function parseQueryStringToObject(queryString) {
    if (queryString && queryString.indexOf('?') > -1) {
        queryString = queryString.replace('?', '')
    }

    let params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
}

/**
 * thêm mới hoặc sửa lại param của query string
 * @param uri
 * @param key
 * @param value
 * @returns {*}
 */
export function updateQueryStringParameter(uri, key, value) {
    if (uri === undefined || uri === null) return '';
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (value === null) {
        return uri.replace(re, '$1' + '$2');
    }
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + encodeURIComponent(value) + '$2');
    }
    else {
        return uri + separator + key + "=" + encodeURIComponent(value);
    }
}

/**
 * format secret id
 * @param id
 */
export function formatSecretId(id) {
    if (id) {
        let length = id.length;
        if (length >= 5) {
            id = '*******' + id[length - 4] + id[length - 3] + id[length - 2] + id[length - 1]
        }

    }
    return id
}

/**
 * chuyển filter sang thành queryString
 * @param filter
 */
export function filterToQueryString(filter) {

    let queryString = '';
    if (filter) {
        // update order
        const order = filter.order;
        if (order) {
            queryString = updateQueryStringParameter(queryString, 'sort', order.split(' ')[0]);
            queryString = updateQueryStringParameter(queryString, 'order', order.split(' ')[1]);
        }

        //update page, limit
        const size = filter.limit || 20;
        const page = (filter.skip || 0) / size;
        if (filter.limit || filter.skip) {
            queryString = updateQueryStringParameter(queryString, 'page', page);
            queryString = updateQueryStringParameter(queryString, 'size', size);
        }

        // xử lý với mảng where.and
        let label = '';
        let query = '';
        if (filter.where && filter.where.and) {
            const and = filter.where.and;
            and.map((item) => {
                if (typeof item === 'object' && !item.or) {
                    //gán label bằng property của item
                    for (let p in item) {
                        label = p;
                    }
                    // nếu item[label] === 'object'
                    if (typeof item[label] === 'object') {
                        //với trường hợp search like
                        if (item[label].ilike) {
                            // query = query + `${label}=${item[label].ilike.replace(/%/g, '')};`;
                            queryString = updateQueryStringParameter(queryString, label, item[label].ilike.replace(/%/g, ''));
                        }
                        //với trường hợp search between
                        if (item[label].between) {
                            if (Array.isArray(item[label].between)) {
                                queryString = updateQueryStringParameter(queryString, label + 'From', item[label].between[0]);
                                queryString = updateQueryStringParameter(queryString, label + 'To', item[label].between[1]);
                            } else {
                                queryString = updateQueryStringParameter(queryString, label + 'From', item[label].between);
                                queryString = updateQueryStringParameter(queryString, label + 'To', item[label].between);
                            }
                            //something
                        }
                    } else {
                        //search equal
                        // query = query + `${label}=${item[label]};`;
                        queryString = updateQueryStringParameter(queryString, label, item[label]);
                    }
                } else if (typeof item === 'object' && item.or) {
                    let orQuery = '(';
                    // trường hợp or
                    item.or.map((i, j) => {
                        for (let p in i) {
                            label = p;
                        }
                        //something
                        orQuery = orQuery + `${label}=${i[label]},`;
                        if (j === item.or.length - 1) orQuery = orQuery + ');'
                    });
                    //loại bỏ dấu ',' ở cuối
                    if (orQuery.indexOf(',') > -1 && orQuery[orQuery.length - 2] === ',') orQuery = orQuery.substr(0, orQuery.length - 2);
                    // add vào query string
                    // query = query + orQuery;
                    queryString = updateQueryStringParameter(queryString, label, orQuery);
                }
            });
            //loại bỏ dấu ';' ở cuối
            // if(query.indexOf(';') > -1 && query[query.length - 1] === ';') query = query.substr(0, query.length - 1);
            // queryString = updateQueryStringParameter(queryString, 'query', query);
        }

        return queryString;
    }
    return ''
}

export function makeid() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function eclipseString(text, length, eclipseChar) {
    let result = '';
    eclipseChar = eclipseChar || '...';
    if (text && typeof text === 'string') {
        if (text.length > length) {
            result = text.substr(0, length - eclipseChar.length) + eclipseChar;
        } else {
            result = text;
        }
    }

    return result
}

export function getTypeByName(text) {
    let result = '';
    if (text && typeof text === 'string') {
        result = text.split('.')[text.split('.').length - 1];
    }

    return result
}

export function convertPhoneToStandardFormat(phone) {
    // console.log('convertPhoneToStandardFormat', phone);
    if (!phone) return null;
    // phone = phone.toString();
    //let newPhone = phone.replace(/ /g, '');
    let newPhone = phone;

    if (newPhone.indexOf('+') === 0) {
        if (newPhone.indexOf('84') === 1) {
            newPhone = newPhone.replace('+84', 0);
        } else {
            return newPhone;
        }
    }

    if (newPhone.indexOf('(+84)') === 0) {
        newPhone = newPhone.replace('(+84)', 0);
    }

    if (newPhone.indexOf('84') === 0) {
        newPhone = newPhone.replace('84', 0);
    }

    if (newPhone.indexOf(' ') === 1) newPhone = newPhone.slice(0, 1) + newPhone.slice(2);


    // if (newPhone.indexOf('0') !== 0) {
    //     newPhone = '0' + newPhone;
    // }

    // if (pattern.test(newPhone)) {
    //     if (newPhone.length === 11) {
    //         return newPhone.trim();
    //     }
    // }

    if (newPhone.indexOf('-') === 0 || newPhone.indexOf('.') === 0) return newPhone;
    if (newPhone[newPhone.length - 1] === '-' || newPhone[newPhone.length - 1] === '.') return newPhone;

    if (newPhone.indexOf('-') > 0 && !/\d{4}-\d{3}-\d{3}/.test(newPhone)) return newPhone;
    if (newPhone.indexOf('.') > 0 && !/\d{4}.\d{3}.\d{3}/.test(newPhone)) return newPhone;
    if (newPhone.indexOf(' ') > 0 && !/\d{4} \d{3} \d{3}/.test(newPhone)) return newPhone;

    newPhone = newPhone.replace(/-/g, '').replace(/\./g, '').replace(/ /g, '');

    // console.log('newPhonenewPhonenewPhone', newPhone);
    return newPhone;
}

/**
 * format số, số lượng có dấu , phân cách hàng nghìn
 * @param value
 * @returns {string}
 */
export const quantityFormat = (value, unit = '') => {
    if (value === null || value === undefined || value === '') return '';

    //loại bỏ tất cả các ký tự ',' trong value
    let temp = value.toString().replace(/[,-]/g, "");
    if (unit) temp = value.toString().replace(unit, "");
    //thay dấu thập phân bằng ','
    temp = temp.replace(/[.-]/g, ",");
    //tách hàng nghìn bằng ký tự '.'
    return temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + unit;
};

/**
 * format tiền, số lượng có dấu , phân cách hàng nghìn, có đơn vị tiền tệ
 * @param value
 * @param unit
 * @returns {string}
 */
export const moneyFormat = (value, unit) => {
    if (value === null || value === '' || value === undefined) return '---';
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
    return quantityFormat(value) + unitTxt;
};
/**
 * cắt tên file
 * @param fileName
 * @param maxLength
 * @returns {*}
 */
export const formatFileName = (fileName, maxLength) => {
    if (!fileName) return '';
    if (fileName.length <= maxLength) return fileName;
    else {
        let endFile = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
        let temp = maxLength - endFile.length;
        let startFile = fileName.substring(0, temp);
        return startFile + endFile;
    }
};
/**
 *
 * @param text
 * @returns {string}
 */
export const linkify = (text) => {
    if (!text) return '';
    let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
    });
};

export const validateLink = (text) => {
    let urlRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
    return urlRegex.test(text);
};

/**
 * Thay thế trong thẻ <a> target="_selft" => target = "_blank"
 * @param text
 */
export const editHTML = (text) => {
    let urlRegex = /self/gm;
    return text.replace(urlRegex, '_blank');
};


/**
 * Thời gian bình luận
 * @returns {*}
 */
export const timeAgo = (dateString) => {
    let currentTime = new Date();
    let timeAgo = new Date(dateString);
    let seconds = currentTime - timeAgo;

    let minutes = Math.ceil(seconds / (60 * 1000));
    let hours = Math.ceil(seconds / (3600 * 1000));
    let days = Math.ceil(seconds / (86400 * 1000));

    if (seconds <= 59 * 1000) {
        return " " + lang.ticket_comment.just_now;
    } else if (minutes <= 60) {
        if (minutes === 1) {
            return " " + lang.ticket_comment.minute;
        } else {
            return minutes + " " + lang.ticket_comment.minutes;
        }
    } else if (hours <= 24) {
        if (hours === 1) {
            return " " + lang.ticket_comment.hour;
        } else {
            return hours + " " + lang.ticket_comment.hours;
        }
    } else {
        return moment(dateString).format('HH:mm DD/MM/YYYY')
    }
};

/**
 * Tính số giờ đã tạo khiếu nại
 * @param dateString: thời gian tạo
 * @return hours: số giờ kể từ thời gian tạo
 */
export const hoursAgo = (dateString) => {
    if (!dateString) return;

    let currentTime = new Date();
    let timeAgo = new Date(dateString);
    let seconds = currentTime - timeAgo;
    let hours = Math.ceil(seconds / (3600 * 1000));
    return hours
};

/**
 *
 * @param key
 * @returns {string}
 */
export const getSearchValue = (key) => {
    let url = window.location.href;
    let value = '';
    if (url.indexOf('?') > -1) {
        let array = url.split('?');
        if (array.length >= 1){
            let queryString = url.split('?')[1];
            const queryObj = parseQueryStringToObject(decodeURIComponent(queryString));
            if (queryObj && queryObj.hasOwnProperty(key)) {
                value = queryObj[key];
            }
        }
    }
    return value;
}
