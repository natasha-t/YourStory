import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

export default class Footer extends React.Component {
  render() {
    return (
      <Grid>
        <hr />
        <footer>
          <p>© 2016 YourStory | Shipped from San Francisco CA</p>
        </footer>
      </Grid>
    );
  }
}
