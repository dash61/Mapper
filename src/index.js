//import 'babel-polyfill';
import React from "react"; //'preact-compat';
import ReactDOM from "react-dom"; //'preact-compat';
import "./index.css";
import { Provider } from "react-redux"; //'preact-redux';
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import registerServiceWorker from "./registerServiceWorker";
import rootReducer from "./reducers/reducers.js";
import App from "./components/App";

const middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

const store = createStore(rootReducer, applyMiddleware(...middleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
