'use strict';

import React from 'react';
import { Link } from 'react-router';

const Nav = () => (
  <div>
    <Link to="/history">History</Link>
    {/* <Link to="/history">History</Link> */}
    <Link to="/categories">Categories</Link>
    <Link to="/graph">Graph</Link>

  </div>
);

export default Nav;
