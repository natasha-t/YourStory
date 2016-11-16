'use strict';

import React from 'react';
import Nav from './nav';

const Container = (props) =>
<div>
  <Nav />
  {props.children}
</div>

export default Container;
