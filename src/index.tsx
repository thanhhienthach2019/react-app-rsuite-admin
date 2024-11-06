import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import mixpanel from 'mixpanel-browser'; 
import './styles/index.less';

const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
// console.log(MIXPANEL_TOKEN);
if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, { debug: true });
  
  mixpanel.track('Page Loaded', {
    page: window.location.pathname,  
  });
} else {
  console.warn('Mixpanel Token is not set!');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
