import React from 'react';
import { connect } from 'react-redux';

// @connect((store) => {
//   return {
//     visData: store.visData,
//   };
// })

// export default class App extends React.Component {
//   render() {
//     return
//     <div>
//       {this.props}
//     </div>
//   }
// }


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
     <div>Hello World from app.jsx</div>
    );
  }
}

export default App;

