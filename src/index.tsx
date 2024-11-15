import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SetupCustomApi } from './http/CustomApi'
import { setupStore } from './store/store'
// import mixpanel from 'mixpanel-browser'; 
import './styles/index.less';
import { Bounce, ToastContainer } from 'react-toastify'; // Thêm ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho react-toastify

// const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
// // console.log(MIXPANEL_TOKEN);
// if (MIXPANEL_TOKEN) {
//   mixpanel.init(MIXPANEL_TOKEN, { debug: true });
  
//   mixpanel.track('Page Loaded', {
//     page: window.location.pathname,  
//   });
// } else {
//   console.warn('Mixpanel Token is not set!');
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
const { store, persistor } = setupStore()
export const customApi = SetupCustomApi(store)
root.render(
  <BrowserRouter>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </PersistGate>
    </Provider>
  </BrowserRouter>
);
