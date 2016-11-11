import React from 'react';
import getToken from '../auth/auth';

export default class Auth extends React.Component {

  render() {
    return (
      <div>
        <button onClick={getToken}>Login with Chrome</button>
      </div>
    );
  }

}
