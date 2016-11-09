import React from 'react';
import {render} from 'react-dom';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';

import App from './components/app';
// import store from './store';

const app = document.getElementById('app');
const anchor = document.createElement('div');
anchor.id = 'yourstory-anchor';

document.body.insertBefore(anchor, document.body.childNodes[0]);
render(<App />, document.getElementById('yourstory-anchor'));

// ReactDOM.render(<Provider store={store}>
// 	<App />
// </Provider>, app);
