import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import "./assets/reset.css";
import App from './App';
import { store } from './app/store.js';
ReactDOM.render(React.createElement(Provider, { store: store },
    React.createElement(App, null)), document.getElementById("root"));
//# sourceMappingURL=index.js.map