import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import queryString from 'querystring'

class FilterComponent extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidUpdate(prevProps) {
        let locationQuery = lodash.get(this.props, 'location.search', '');
        let queryParse = queryString.parse(locationQuery.replace("?", ""));
        if (JSON.stringify(this.props.location) !== JSON.stringify(prevProps.location)) {
            this.setState({
                filter: queryParse
            });
            if (queryParse) {
                this.onSearch(queryParse, false);
            }
        }
    }

    componentDidMount() {
        let locationQuery = lodash.get(this.props, 'location.search', '');
        let queryParse = queryString.parse(locationQuery.replace("?", ""));
        this.setState({
            filter: queryParse
        });
        this.onSearch(queryParse, false)
    }

    /**
     * Push query params into url
     * @param filter
     */
    onPushQuery(filter = {}) {}

    /**
     * Call api
     */
    onSearch() {}

    /**
     * Input change
     * @param key
     * @param value
     * @returns {{}}
     */
    onInputChange = (key, value) => {
        let filter = {...this.state.filter};

        lodash.merge(filter, {[key]: value});
        this.setState({
            filter,
            originFilter: true,
        });

        if (value === "") {
            delete filter[key];
        }
        return filter;
    };

    /**
     * When Enter then push query params into url
     * @param key
     * @param value
     */
    onInputEnter = (key, value) => {
        this.onInputChange(key, value);
        this.onPushQuery();
    };

    /**
     * Select range of date
     * @param e
     * @param from
     * @param to
     */
    onChangeRangeDate = (e, from, to) => {
        let filter = lodash.merge({}, this.state.filter);
        if (e && e.length) {
            filter[from] = e[0].startOf('day').toISOString();
            filter[to] = e[1].endOf('day').toISOString();
        } else {
            delete filter[from];
            delete filter[to];
        }
        this.setState({filter});
    };
}

FilterComponent.propTypes = {
    filter: PropTypes.object
};

export default FilterComponent;