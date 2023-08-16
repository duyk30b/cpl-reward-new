import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import "antd/dist/antd.css";
import "@ant-design/pro-layout/dist/layout.css";
import "./reset.css";
import App from './App';
import { store } from './app/store.js';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
