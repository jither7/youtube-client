import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import '../node_modules/antd/dist/antd.less';
import App from './App';
import './resources/localization/i18n'

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(<App/>, document.getElementById('root'));
