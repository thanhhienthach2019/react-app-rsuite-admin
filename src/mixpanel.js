// src/mixpanel.js

import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN);
} else {
  console.warn('Mixpanel Token is not set!');
}

const trackEvent = (eventName, properties = {}) => {
  if (mixpanel) {
    mixpanel.track(eventName, properties);
  }
};

export { trackEvent };
