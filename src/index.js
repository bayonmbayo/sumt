import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from './helpers';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Access preloaded state injected by the server
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// Reconfigure the store to inject preloadedState properly
const configuredStore = store

// Tell react-snap how to save Redux state
window.snapSaveState = () => ({
  __PRELOADED_STATE__: configuredStore.getState()
});

// Render your app
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={configuredStore}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
