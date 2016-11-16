'use strict';

import React from 'react';
import { Link } from 'react-router';

const Nav = () => (
  <div>
    <Link to="/history">History</Link>
    {/* <Link to="/history">History</Link> */}
    <Link to="/categories">Categories</Link>
  </div>
);

export default Nav;
